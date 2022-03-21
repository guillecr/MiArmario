const DPrendas = require('./Entities/DPrendas');
const DUsers = require('./Entities/DUsers');
const DMenus = require('./Entities/DMenus');
const DClosets = require('./Entities/DClosets');

const Commands = require('./Utils/Commands');
const DBParams = require('./Utils/DBParamas');
const LogFile = require('./Utils/LogFile');
const bcrypt = require("bcryptjs");

class CallAPI {

    static calls(socket){
        // Llamadas IO
        var accessDB = {db: null, user: null, socket: socket};
        console.log((new Date()) + ' => Nueva conexión aceptada')
        LogFile.writeLog('Nueva conexión aceptada');
        
        socket.on('LoginIn', async (loginParams) => {
            var params = new DBParams;
            var tmpAccess = {db:db, user: 2}; // User 2: API_LOGIN_IN
            var user = await DUsers.Find(tmpAccess, 'AND TX_LOGIN = ' + params.addParams(loginParams.login), params);
            if (user){
                if (await bcrypt.compare(loginParams.pw,user[0].TxPassword)){
                    // PW correcto
                    accessDB.db = db;
                    accessDB.user = user[0].IdUser;
                    user[0].FhLastLogin = Date.now();
                    await user[0].Update(accessDB);
                    LogFile.writeLog(`Usuario logeado: ${user[0].TxLogin} (${user[0].IdUser})`);
                    socket.emit('withAccess', true);

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

        socket.on('setPwTEST', async (newPw) => {
            if (CallAPI.withAccessDB(accessDB)){
                var user = await DUsers.Id(accessDB, accessDB.user);
                user.TxPassword = await bcrypt.hash(newPw, 10);
                await user.Update(accessDB.db);
                socket.emit("mensaje", true); 
            }
        });

        socket.on('getMenus', async () => {
            if (CallAPI.withAccessDB(accessDB)){
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
                socket.emit("mensaje", menus); 
            }
        });

        socket.on('createUser', async (user) => {
            if (CallAPI.withAccessDB(accessDB)){
                var user = new DUsers(null, user.TxName, user.TxLogin)
            }
        })

        socket.on('access', () => {
            socket.emit('withAccess', CallAPI.withAccessDB(accessDB));
        });

        socket.on('disconnect', () => {
            accessDB = null;
            console.log((new Date()) + ' => Usuario desconectado');
        });

        socket.on('test',(msg) => {
            console.log('Petición tipo test: ' + msg);
            io.emit("mensaje",'Hola desde la API');
        });

        socket.on('TestPrenda', async () => {
            if (CallAPI.withAccessDB(accessDB)){
                var prenda = await DPrendas.Id(accessDB, 1);
                socket.emit("TEST", prenda.getData());
            }
        });

        socket.on('TestMenu', async () => {
            if (CallAPI.withAccessDB(accessDB)){
                var menu1 = new DMenus(1);
                await menu1.Read(accessDB,1);
                console.log(menu1);
                socket.emit("TEST", menu1);
            }
        });

        socket.on('TestClosets', async (idClosets) => {
            if (CallAPI.withAccessDB(accessDB)){
                var closet = await DClosets.Id(accessDB, idClosets);
                socket.emit("TEST", (closet)? closet.getData(): null);
            }
        });

        socket.on('TestUser', async () => {
            if (CallAPI.withAccessDB(accessDB)){
                var user = await DUsers.Id(accessDB, 1);
                socket.emit("TEST", (user)? user.getData(): null);
            }
        });

        socket.on('TestParams', async () => {
            if (CallAPI.withAccessDB(accessDB)){
                var params = new DBParams;
                var menu = await DMenus.Find(accessDB, `AND TX_NAME = ${params.addParams("Inicio")}`, params);
                socket.emit("TEST", menu);
            }
        });

        socket.on('TestInsert', async () => {
            if (CallAPI.withAccessDB(accessDB)){
                var newClosets = new DClosets(null, "Calcetines", 1, "Calcetines cortos", 1);
                console.log('ANTES:');
                console.log(newClosets);
                await newClosets.Insert(accessDB);
                console.log('DESPUES:');
                console.log(newClosets);
                socket.emit("TEST", newClosets);
            }
        });

        socket.on('TestUpdate', async (idClosets) => {
            if (CallAPI.withAccessDB(accessDB)){
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
            }
        });
    }

    // TODO: Con esta función podemos crear tokens que devolvemos al cliente y verificar la vida de este mismo
    static withAccessDB(accessDB){
        if (!!accessDB.db){
            return true
        } else {
            accessDB.socket.emit('withAccess', false);
            return false
        }
    }

}

module.exports = CallAPI;