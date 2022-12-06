const DPrendas = require('./Entities/DPrendas');
const DUsers = require('./Entities/DUsers');
const DMenus = require('./Entities/DMenus');
const DClosets = require('./Entities/DClosets');
const DForms = require('./Entities/DForms');
const DFormFields = require('./Entities/DFormFields');
const ExtImgs = require('./Entities/ExtImgs');

const Commands = require('./Utils/Commands');
const DBParams = require('./Utils/DBParamas');
const LogFile = require('./Utils/LogFile');

// Páginas
const PagMisPrendas = require("./pages/PagMisPrendas");
const PagLogin = require("./pages/PagLogin");
const PagTest = require("./pages/PagTest");
const PagFormDesigner = require('./pages/PagFormDesigner');

// Componentes
const DynamicForm = require('./Componets/DynamicForm');
const DynamicList = require('./Componets/DynamicList');
const PagListDesigner = require('./pages/PagListDesigner');
const TokenManager = require('./Utils/TokenManager');


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

    static authenticationByToken(token, address){
        // TODO: verificación del token con la IP
        var idUser = null;
        try {
            var aut = TokenManager.authentication(token);
            if (aut.result == "TOKEN_EXPIRE") {
                // Token caducado
                LogFile.writeLog(`Token de la conexión ${address} a expirado`);

            } else if (aut.result == "ERROR") {
                LogFile.writeLog('ERROR - authenticationByToken: ' + aut.message);

            } else if (aut.result == "OK") {
                idUser = aut.idUser;
            }
            
        } catch (ex){
            LogFile.writeLog('ERROR - authenticationByToken: ' + ex.message);
        }
        return idUser;
    }

    static getSession(socket){
        try {
            var idUser = this.authenticationByToken(this.getTokenInHead(socket), socket.request.connection.remoteAddress);
            if (idUser){
                DUsers.Id({linkDB: db, user: 2}, idUser)
                    .then(function(user){
                        if (!user){
                            // Error muy raro
                            LogFile.writeLog('ERROR - autentificación: Token valido con usuario no localizado. ID User: ' + idUser);
                            socket.accessDB.user = null;
                        } else {
                            socket.accessDB.user = user.IdUser; // Damos permisos
                            socket.emit('withAccess', user.TxLogin);
                        }
                    });                
            } else {
                LogFile.writeLog(`Conexión sin acreditación`);
                socket.emit('withAccess', false);
            }
        } catch (ex){
            LogFile.writeLog('ERROR - getSession: ' + ex.message);
        }
    }

    static calls(socket){
        // Llamadas IO
        var address = socket.request.connection.remoteAddress;
        socket.accessDB = { linkDB: db, user: null };
        console.log((new Date()) + ` => Nueva conexión aceptada (${address})`)
        LogFile.writeLog(`Nueva conexión aceptada (${address})`);
        // Comprobar acreditación inicial
        CallAPI.getSession(socket);

        socket.use(([event, ...args], next) => {
            // events: Nombre de la llamada
            // args: Parámetros a la llamada
            // Utilizamos este mecanismo para la autentificación
            // TODO: En este punto podemos verificar si el usuario tiene permisos para la acción que solicita
            try {
                if (CallAPI.authenticationByToken(CallAPI.getTokenInHead(socket), address)){
                    // Conexión acreditada
                    next();
                } else if(event == 'getMenus') {
                    // Conexión no acreditada
                    socket.accessDB.user = 4;
                    next();
                } else if (event == 'LoginIn') {
                    socket.accessDB.user = 2; // User 2 => API_LOGIN_IN
                    next(); 
                } else {
                    // Acceso denegado
                    socket.accessDB.user = null;
                    socket.emit('withAccess', false);
                }
            } catch (ex){
                LogFile.writeLog('ERROR - manejador de eventos: ' + ex.message);
                socket.accessDB.user = null;
                socket.emit('withAccess', false); // Ante un fallo no damos permisos
            }
        });

        socket.on('getMenus', async () => {
            console.log("Usuario para getMenus: " + socket.accessDB.user);
            try {
                var params = new DBParams;
                var menus = await DMenus.Find(socket.accessDB, `AND ID_MENU IN (
                        SELECT PM.CD_MENU
                        FROM R_PROFILES_MENUS PM
                            ,R_PROFILES_USERS PU
                        WHERE PM.CD_PROFILE = PU.CD_PROFILE
                            AND PU.CD_USER = ${params.addParams(socket.accessDB.user)}
                            AND PU.CH_ACTIVE = 1
                            AND PM.CH_ACTIVE = 1)
                    AND CH_ACTIVE = 1`, params);
                socket.emit("Menus", menus); 
            } catch (ex) {
                LogFile.writeLog('ERROR - getMenus: ' + ex.message);
            }
        });

        socket.on('createUser', async (user) => {
            try {
                var user = new DUsers(null, user.TxName, user.TxLogin);
                await user.Insert(socket.accessDB);
            } catch (ex) {
                console.log('Error en createUser: ' + ex.message);
            }
        });

        socket.on('disconnect', () => {
            console.log((new Date()) + ' => Usuario desconectado');
        });

        socket.on('test',(msg) => {
            console.log('Petición tipo test: ' + msg);
            io.emit("mensaje",'Hola desde la API');
        });

        PagMisPrendas.calls(socket);
        PagLogin.calls(socket);
        PagTest.calls(socket);
        PagFormDesigner.calls(socket);
        DynamicForm.calls(socket);
        DynamicList.calls(socket);
        PagListDesigner.calls(socket);
    }


}

module.exports = CallAPI;