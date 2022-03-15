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
            var user = await DUsers.Find(db, 'AND TX_LOGIN = ' + params.addParams(loginParams.login), params);
            if (user){
                if (await bcrypt.compare(loginParams.pw,user[0].TxPassword)){
                    // PW correcto
                    accessDB.db = db;
                    accessDB.user = user[0].IdUser;
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
                var user = await DUsers.Id(accessDB.db, accessDB.user);
                user.TxPassword = await bcrypt.hash(newPw, 10);
                await user.Update(accessDB.db);
                socket.emit("mensaje", true); 
            }
        });

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
                var prenda = await DPrendas.Id(db,1);
                socket.emit("TEST", prenda.getData());
            }
        });

        socket.on('TestMenu', async () => {
            if (CallAPI.withAccessDB(accessDB)){
                var menu1 = new DMenus(1);
                await menu1.Read(db,1);
                console.log(menu1);
                socket.emit("TEST", menu1);
            }
        });

        socket.on('TestClosets', async (idClosets) => {
            if (CallAPI.withAccessDB(accessDB)){
                var closet = await DClosets.Id(db, idClosets);
                socket.emit("TEST", (closet)? closet.getData(): null);
            }
        });

        socket.on('TestUser', async () => {
            if (CallAPI.withAccessDB(accessDB)){
                var user = await DUsers.Id(db, 1);
                socket.emit("TEST", (user)? user.getData(): null);
            }
        });

        socket.on('TestParams', async () => {
            if (CallAPI.withAccessDB(accessDB)){
                var params = new DBParams;
                var menu = await DMenus.Find(db, `AND TX_NAME = ${params.addParams("Inicio")}`, params);
                socket.emit("TEST", menu);
            }
        });

        socket.on('TestInsert', async () => {
            if (CallAPI.withAccessDB(accessDB)){
                var newClosets = new DClosets(null, "Calcetines", 1, "Calcetines cortos", 1);
                await newClosets.Insert(db);
                socket.emit("TEST", result.affectedID);
            }
        });

        socket.on('TestUpdate', async (idClosets) => {
            if (CallAPI.withAccessDB(accessDB)){
                var closet = await DClosets.Id(db, idClosets);
                closet.user = 10;
                if (await closet.Update(accessDB.db) > 0){
                    socket.emit("TEST", "OK");

                } else {
                    socket.emit("TEST", "ERROR");

                }
            }
        });
    }

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