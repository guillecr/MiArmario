const DUsers = require('./Entities/DUsers');
const DMenus = require('./Entities/DMenus');

const DBParams = require('./Utils/DBParamas');
const LogFile = require('./Utils/LogFile');

// Páginas
const PagMisPrendas = require("./pages/PagMisPrendas");
const PagLogin = require("./pages/PagLogin");
const PagFormDesigner = require('./pages/PagFormDesigner');
const PagMenus = require('./pages/PagMenus');
const PagGestionLiterales = require('./pages/PagGestionLiterales');
const PagUsers = require('./pages/PagUsers');
const PagPermissions = require('./pages/PagPermissions');
const PagListDesigner = require('./pages/PagListDesigner');
const PagArmarios = require('./pages/PagArmarios');
const PagChangePw = require('./pages/PagChangePw');

// Componentes
const DynamicForm = require('./Componets/DynamicForm');
const DynamicList = require('./Componets/DynamicList');
const TokenManager = require('./Utils/TokenManager');
const Commands = require('./Utils/Commands');

class CallAPI {

    static callsDB(socket){
        // Con esta rutina se puede construir las llamadas definidas en la base de datos.
        var init = CallAPI.calls.toString().substring(14,CallAPI.calls.toString().length-1);
        var codePrendas = PagMisPrendas.calls.toString().substring(8, PagMisPrendas.calls.toString().length-1);
        var fullCalls = init + "\n" + codePrendas;
        eval(fullCalls);
    }

    static getTokenInHead(socket){
        return socket.handshake.auth.token;
    }
    static getIp(socket){
        return socket.request.connection.remoteAddress;
    }

    static getAuthentication(socket){
        // TODO: verificación del token con la IP
        var idUser = null;
        var token = CallAPI.getTokenInHead(socket);
        var address = CallAPI.getIp(socket);
        try {
            var aut = TokenManager.checkToken(token);
            if (aut.result == "TOKEN_EXPIRE") {
                // Token caducado
                LogFile.writeLog(`Token de la conexión ${address} a expirado`);

            } else if (aut.result == "ERROR") {
                LogFile.writeLog('ERROR - getIdUserInToken: ' + aut.message);

            } else if (aut.result == "OK") {
                idUser = aut.idUser;
            }
            
        } catch (ex){
            LogFile.writeLog('ERROR - getIdUserInToken: ' + ex.message);
        }
        return idUser;
    }

    static getSession(socket){
        var result = false;
        try {
            var idUser = this.getAuthentication(socket);
            if (idUser){
                DUsers.Id({linkDB: db, user: 2}, idUser)
                    .then(function(user){
                        if (!user){
                            // Error muy raro
                            LogFile.writeLog('ERROR - autentificación: Token valido con usuario no localizado. ID User: ' + idUser);
                            socket.accessDB.user = null;
                        } else {
                            socket.accessDB.user = user.IdUser; // Damos permisos
                            socket.accessDB.login = user.TxLogin;
                            result = true;  
                        }
                    });                
            } else {
                LogFile.writeLog(`Conexión sin acreditación`);
                socket.emit('withAccess', false);
            }
        } catch (ex){
            LogFile.writeLog('ERROR - getSession: ' + ex.message);
        }
        return result;
    }

    static calls(socket){
        // Llamadas IO
        socket.accessDB = { linkDB: db, user: null };
        console.log((new Date()) + ` => Nueva conexión aceptada (${CallAPI.getIp(socket)})`)
        LogFile.writeLog(`Nueva conexión aceptada (${CallAPI.getIp(socket)})`);
        // Comprobar acreditación inicial
        if (CallAPI.getSession(socket)){
            socket.emit('withAccess', socket.accessDB.login);
        }

        socket.use(async ([event, ...args], next) => {
            // events: Nombre de la llamada
            // args: Parámetros a la llamada
            // Utilizamos este mecanismo para la autentificación
            // Dentro de next() podemos definir una función que se ejecute antes del evento
            // TODO: En este punto podemos verificar si el usuario tiene permisos para la acción que solicita
            try {
                //LogFile.writeLog(`${socket.accessDB.login}: ${event}`);
                var allower = false;
                var idUserCall = CallAPI.getAuthentication(socket);
                if (event == 'getMenus' || event == 'LoginIn') {
                    if (!idUserCall){
                        socket.accessDB.user = 4; // Sin login
                    }
                    allower = true;
                } else if (idUserCall) {
                    var menuCall = event.split(".")[0];
                    var cmd = new Commands(socket.accessDB.linkDB);
                    cmd.sentencia = `
                    SELECT 1 FROM R_PROFILES_MENUS PM
                    JOIN R_PROFILES_USERS PU ON PM.CD_PROFILE = PU.CD_PROFILE
                    WHERE PM.CD_MENU = ${cmd.addParams(menuCall)}
                        AND PU.CD_USER = ${cmd.addParams(idUserCall)}
                    `
                    var resultSql = await cmd.ejecutarSentencia();
                    if (resultSql.length > 0){
                        // Tiene permiso
                        allower = true;
                    } else {
                        LogFile.writeLog("Acceso no autorizado: " + socket.accessDB.login + " -> " +  menuCall);
                    }
                } else {
                    // Token no valido
                    socket.accessDB.user = null;
                    socket.emit('withAccess', false);
                }

                if (allower){
                    // Acceso permitido
                    next();
                } else {
                    // Acceso denegado
                    // TODO: Devolver una respuesta
                }              
                
            } catch (ex){
                LogFile.writeLog('ERROR - manejador de eventos: ' + ex.message);
            }
        });

        socket.on('getMenus', async () => {
            try {
                var params = new DBParams;
                var menus = await DMenus.Find(socket.accessDB, `AND CD_COMPONENT IN (
                        SELECT PM.CD_MENU
                        FROM R_PROFILES_MENUS PM
                            ,R_PROFILES_USERS PU
                        WHERE PM.CD_PROFILE = PU.CD_PROFILE
                            AND PU.CD_USER = ${params.addParams(socket.accessDB.user)}
                            AND PU.CH_ACTIVE = 1
                            AND PM.CH_ACTIVE = 1)
                    AND TX_PATH IS NOT NULL
                    AND CH_ACTIVE = 1
                    ORDER BY NU_ORDER`, params);
                socket.emit("Menus", menus); 
            } catch (ex) {
                LogFile.writeLog('ERROR - getMenus: ' + ex.message);
            }
        });

        socket.on('disconnect', () => {
            console.log((new Date()) + ' => Usuario desconectado');
        });

        PagMisPrendas.createCalls(socket);
        PagLogin.calls(socket); // Clase especial
        PagFormDesigner.createCalls(socket);
        DynamicForm.createCalls(socket);
        DynamicList.createCalls(socket);
        PagListDesigner.createCalls(socket);
        PagMenus.createCalls(socket);
        PagGestionLiterales.createCalls(socket);
        PagUsers.createCalls(socket);
        PagPermissions.createCalls(socket);
        PagArmarios.createCalls(socket);
        PagChangePw.createCalls(socket);
    }

}

module.exports = CallAPI;