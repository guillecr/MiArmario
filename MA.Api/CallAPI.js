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
const bcrypt = require("bcryptjs");
const jwt = require("jwt-simple");

// Páginas
const PagMisPrendas = require("./pages/PagMisPrendas");
const PagLogin = require("./pages/PagLogin");
const PagTest = require("./pages/PagTest");
const DynamicForm = require('./Componets/DynamicForm');
const PagFormDesigner = require('./pages/PagFormDesigner');

class CallAPI {

    static callsDB(socket){
        // Con esta rutina se puede construir las llamadas definidas en la base de datos.
        var init = CallAPI.calls.toString().substring(14,CallAPI.calls.toString().length-1);
        var codePrendas = PagMisPrendas.calls.toString().substring(8, PagMisPrendas.calls.toString().length-1);
        var fullCalls = init + "\n" + codePrendas;
        eval(fullCalls);

    }

    static calls(socket){
        // Llamadas IO
        var address = socket.request.connection.remoteAddress;
        socket.accessDB = { linkDB: db, user: null };
        console.log((new Date()) + ` => Nueva conexión aceptada (${address})`)
        LogFile.writeLog(`${new Date()} => Nueva conexión aceptada (${address})`);
        
        // Comprobar acreditación inicial
        if (CallAPI.getTokenInHead(socket)){
            try {
                socket.accessDB.user = CallAPI.authenticationByToken(socket);
                // Sin uso de await
                DUsers.Id(socket.accessDB, socket.accessDB.user)
                    .then(function(user){
                        if (!user){
                            LogFile.writeLog('ERROR - autentificación: Token valido con usuario no localizado. ID User: ' + socket.accessDB.user);
                        } else {
                            socket.emit('withAccess', user.TxLogin);
                        }
                    });
                
            } catch (ex){
                LogFile.writeLog('ERROR - getSession: ' + ex.message);
            }
        } else {
            LogFile.writeLog(`${new Date()} => Conexión sin acreditación`);
            socket.emit('withAccess',false);
        }

        socket.use(([event, ...args], next) => {
            // events: Nombre de la llamada
            // args: Parámetros a la llamada
            // Utilizamos este mecanismo para la autentificación
            // TODO: En este punto podemos verificar si el usuario tiene permisos para la acción que solicita
            try {
                socket.accessDB.user = CallAPI.authenticationByToken(socket);
                next();
            } catch (ex){
                // Excepciones
                if (event == 'getMenus'){
                    socket.accessDB.user = 4; // 4 => Usuario sin permisos
                    next();
                } else if (event == 'LoginIn'){
                    socket.accessDB.user = 2; // User 2 => API_LOGIN_IN
                    next(); 
                
                } else {
                    // Sin autentificación
                    socket.accessDB.user = null;
                    socket.emit('withAccess', false);
                }   
            }
        });

        socket.on('LoginIn', async (loginParams) => {
            var params = new DBParams;
            var user = await DUsers.Find(socket.accessDB, 'AND TX_LOGIN = ' + params.addParams(loginParams.login), params);
            if (user){
                if (await bcrypt.compare(loginParams.pw, user[0].TxPassword)){
                    socket.accessDB.user = user[0].IdUser;
                    // PW correcto
                    var token = CallAPI.getToken(user[0].IdUser);                    
                    user[0].FhLastLogin = Date.now();
                    await user[0].Update(socket.accessDB);
                    // Acreditamos la conexión para futuras peticiones
                    socket.handshake.auth.token = token;
                    socket.emit('token', token); // Emitimos su token para permitir acreditarse sin logearse si recarga la página
                    LogFile.writeLog(`Usuario logeado: ${user[0].TxLogin} (${user[0].IdUser})`);
                    socket.emit('withAccess', user[0].TxLogin); // Le indicamos que tiene acceso y el nombre de usuario
                } else {
                    // PW incorrecto
                    socket.emit('withAccess', false);
                    LogFile.writeLog('LoginIn PW erroneo: ' + loginParams.login); 
                }
            } else {
                // Login no localizado
                socket.emit('withAccess', false);
                LogFile.writeLog('LoginIn Login no localizado: ' + loginParams.login); 
            }
        });

        socket.on('getMenus', async () => {
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

        // socket.on('getDynamicForm', async (IdForm) => {
        //     try {
        //         var params = new DBParams;
        //         var objForm = await DForms.Id(socket.accessDB, IdForm);
        //         var listFormFields = await DFormFields.Find(socket.accessDB, 'AND CD_FORM = ' + params.addParams(objForm.IdForm) + 'AND CH_ACTIVE = 1', params);
        //         socket.emit("getDynamicFormResponse", {objForm: objForm, listFormField: listFormFields });
        //     } catch (ex) {
        //         console.log('ERROR - getDynamicForm: ' + ex.message);
        //     }
        // });

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
        //PagLogin.calls(socket);
        PagTest.calls(socket);
        PagFormDesigner.calls(socket);
        DynamicForm.calls(socket);
        // socket.on("DynamicFormGetInfo", async(IdForm) => {
        //     try{
        //         var params = new DBParams
        //         var listFields = await DFormFields.Find(socket.accessDB, `AND CD_FORM = ${params.addParams(IdForm)} AND CH_ACTIVE = 1`, params);
        //         socket.emit("DynamicFormGetInfoResponse", listFields);
        //     }
        //     catch(ex) {
        //         LogFile.writeLog('ERROR - DynamicFormGetInfo: ' + ex.message);
        //     }
        // });
    }

    static authenticationByToken(socket, token){
        if (!token) {
            token = CallAPI.getTokenInHead(socket);
        }
        var user = CallAPI.checkToken(token);
        if (user){
            return user;
        } else {
            throw {message: 'Token no valido'};
        }
    }

    static checkToken(token){
        if (!token){
            // No tenemos token
            return null;
        } else { 
            var payload = null;
            try {    
                payload = jwt.decode(token, PARAMS.TOKEN_KEY);
                if (payload.exp > (Date.now() / 1000)) {
                    return payload.sub;
                } else {
                    // Token exirado
                    LogFile.writeLog(`Token del usuario ${payload.sub} a expirado`);
                    return null;
                }    
            } catch (ex){
                LogFile.writeLog('ERROR - checkToken: ' + ex.message);
                return null;
            }
        }
    }

    static getToken(idUser){
        var fechEnd = new Date(Date.now());
        fechEnd.setDate(fechEnd.getDate() + 14);
        var payload = {
            sub: idUser,
            iat: Math.floor(Date.now() / 1000),
            exp: fechEnd.getTime(),
          };
          return jwt.encode(payload, PARAMS.TOKEN_KEY);
    }

    static getTokenInHead(socket){
        return socket.handshake.auth.token;
    }
}

module.exports = CallAPI;