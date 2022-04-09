const DPrendas = require('./Entities/DPrendas');
const DUsers = require('./Entities/DUsers');
const DMenus = require('./Entities/DMenus');
const DClosets = require('./Entities/DClosets');

const Commands = require('./Utils/Commands');
const DBParams = require('./Utils/DBParamas');
const LogFile = require('./Utils/LogFile');
const bcrypt = require("bcryptjs");
const jwt = require("jwt-simple");

class CallAPI {

    static calls(socket){
        // Llamadas IO
        var token = null;
        var address = socket.request.connection.remoteAddress;
        console.log((new Date()) + ` => Nueva conexión aceptada (${address})`)
        LogFile.writeLog(`${new Date()} => Nueva conexión aceptada (${address})`);
        //socket.emit('withAccess', false);

        socket.on('LoginIn', async (loginParams) => {
            var params = new DBParams;
            var accessDB = {linkDB: db, user: 2}; // User 2: API_LOGIN_IN
            var user = await DUsers.Find(accessDB, 'AND TX_LOGIN = ' + params.addParams(loginParams.login), params);
            if (user){
                if (await bcrypt.compare(loginParams.pw,user[0].TxPassword)){
                    // PW correcto
                    token = CallAPI.getToken(user[0].IdUser);                    
                    user[0].FhLastLogin = Date.now();
                    await user[0].Update(accessDB);

                    LogFile.writeLog(`Usuario logeado: ${user[0].TxLogin} (${user[0].IdUser})`);
                    socket.emit('withAccess', user[0].TxLogin);
                    socket.emit('token', token);

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

        socket.on('getSession', async(request) => {
            try {
                var accessDB = CallAPI.getAccessDBByToken(request.token, socket);
                token = request.token;
                var user = await DUsers.Id(accessDB, accessDB.user);
                socket.emit('withAccess', user.TxLogin);
            } catch (ex){
                LogFile.writeLog('ERROR - getSession: ' + ex.message);
            }
        });

        socket.on('getToken', async () => {
            socket.emit("mensaje", CallAPI.getToken(accessDB.user));
        });

        socket.on('setPwTEST', async (request) => {
            try {
                var accessDB = CallAPI.getAccessDBByToken(request.token, socket);
                var user = await DUsers.Id(accessDB, accessDB.user);
                user.TxPassword = await bcrypt.hash(newPw, 10);
                await user.Update(accessDB);
                socket.emit("mensaje", true); 
            } catch (ex){
                LogFile.writeLog('ERROR - setPwTEST: ' + ex.message);
            }
        });

        socket.on('getMenus', async () => {
            try {
                var idUser = CallAPI.checkToken(token);
                if (!idUser){ // 4 => Usuario sin permisos
                    idUser = 4;
                }
                var accessDB = {linkDB: db, user: idUser} 
                var params = new DBParams;
                var menus = await DMenus.Find(accessDB, `AND ID_MENU IN (
                        SELECT PM.CD_MENU
                        FROM R_PROFILES_MENUS PM
                            ,R_PROFILES_USERS PU
                        WHERE PM.CD_PROFILE = PU.CD_PROFILE
                            AND PU.CD_USER = ${params.addParams(accessDB.user)}
                            AND PU.CH_ACTIVE = 1
                            AND PM.CH_ACTIVE = 1)
                    AND CH_ACTIVE = 1`, params);
                socket.emit("Menus", menus); 
            } catch (ex){
                LogFile.writeLog('ERROR - getMenus: ' + ex.message);
            }
        });

        socket.on('createUser', async (user) => {
            if (CallAPI.withAccessDB(accessDB)){
                var user = new DUsers(null, user.TxName, user.TxLogin)
            }
        })

        socket.on('disconnect', () => {
            console.log((new Date()) + ' => Usuario desconectado');
        });

        socket.on('test',(msg) => {
            console.log('Petición tipo test: ' + msg);
            io.emit("mensaje",'Hola desde la API');
        });

        socket.on('TestPrenda', async () => {
            try {
                var accessDB = CallAPI.getAccessDBByToken(request.token, socket);
                var prenda = await DPrendas.Id(accessDB, 1);
                socket.emit("TEST", prenda.getData());
            } catch (ex){
                LogFile.writeLog('ERROR - TestPrenda: ' + ex.message);
            }
        });

        socket.on('TestMenu', async () => {
            try {
                var accessDB = CallAPI.getAccessDBByToken(request.token, socket);
                var menu1 = new DMenus(1);
                await menu1.Read(accessDB,1);
                console.log(menu1);
                socket.emit("TEST", menu1);
            } catch (ex){
                LogFile.writeLog('ERROR - TestMenu: ' + ex.message);
            }
        });

        socket.on('TestClosets', async (idClosets) => {
            try {
                CallAPI.withAccessDB(accessDB);
                var closet = await DClosets.Id(accessDB, idClosets);
                socket.emit("TEST", (closet)? closet.getData(): null);
            } catch (ex){
                LogFile.writeLog('ERROR - TestClosets: ' + ex.message);
            }
        });

        socket.on('TestUser', async () => {
            try {
                var accessDB = CallAPI.getAccessDBByToken(request.token, socket);
                var user = await DUsers.Id(accessDB, 1);
                socket.emit("TEST", (user)? user.getData(): null);
            } catch (ex){
                LogFile.writeLog('ERROR - TestUser: ' + ex.message);
            }
        });

        socket.on('TestParams', async () => {
            try {
                var accessDB = CallAPI.getAccessDBByToken(request.token, socket);
                var params = new DBParams;
                var menu = await DMenus.Find(accessDB, `AND TX_NAME = ${params.addParams("Inicio")}`, params);
                socket.emit("TEST", menu);
            } catch (ex){
                LogFile.writeLog('ERROR - TestParams: ' + ex.message);
            }
        });

        socket.on('TestInsert', async () => {
            try {
                var accessDB = CallAPI.getAccessDBByToken(request.token, socket);
                var newClosets = new DClosets(null, "Calcetines", 1, "Calcetines cortos", 1);
                console.log('ANTES:');
                console.log(newClosets);
                await newClosets.Insert(accessDB);
                console.log('DESPUES:');
                console.log(newClosets);
                socket.emit("TEST", newClosets);
            } catch (ex){
                LogFile.writeLog('ERROR - TestInsert: ' + ex.message);
            }
        });

        socket.on('TestUpdate', async (idClosets) => {
            try {
                var accessDB = CallAPI.getAccessDBByToken(request.token, socket);
                var closet = await DClosets.Id(accessDB, idClosets);
                console.log("ANTES");
                console.log(closet);
                closet.CdUser = 10;
                if (await closet.Update(accessDB) > 0){
                    console.log("DESPUES");
                    console.log(closet);
                    socket.emit("TEST", "OK");

                } else {
                    socket.emit("TEST", "ERROR");

                }
            } catch (ex){
                LogFile.writeLog('ERROR - TestUpdate: ' + ex.message);
            }
        });
    }

    static getAccessDBByToken(token, socket){
        var user = CallAPI.checkToken(token);
        if (user){
            return {linkDB: db, user: user};
        } else {
            if (socket){
                socket.emit('withAccess', false);
            }
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
}

module.exports = CallAPI;