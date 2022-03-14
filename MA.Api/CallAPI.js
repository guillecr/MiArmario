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
        var accessDB = {db: null, user: null};
        console.log((new Date()) + ' => Nueva conexión aceptada')
        LogFile.writeLog('Nueva conexión aceptada');
        DMenus.Find(db)
            .then(function(registro){
                socket.emit("MenuActionsRes", registro);
            });
        
        socket.on('LoginIn', (loginParams) => {
            var params = new DBParams;
            DUsers.Find(db, 'AND TX_LOGIN = ' + params.addParams(loginParams.login), params)
                .then(function(user){
                    if (user[0]){
                        bcrypt.compare(loginParams.pw,user[0].TxPassword, (err, compare) => {
                            if(err){
                                LogFile.writeLog('ERROR LoginIn: ' + err);
                                socket.emit('user', 'ERROR');
                            } else if (compare){
                                socket.emit('user', user[0].IdUser);
                                accessDB.db = db;
                                accessDB.db = user[0].IdUser;
                                LogFile.writeLog(`Usuario logeado: ${user[0].TxLogin} (${user[0].IdUser})`);
                            } else {
                                socket.emit('user', null);
                                LogFile.writeLog('PW erroneo: ' + loginParams.login);        
                            }
                        });
                    } else {
                        socket.emit('user', null);
                        LogFile.writeLog('Login erroneo: ' + loginParams.login);
                        //socket.disconnect();
                    }
                });
        });

        socket.on('setPwTEST', (newPw) => {
            if (CallAPI.withAccessDB(accessDB)){
                DUsers.Id(accessDB.db, accessDB.user)
                    .then(function(user){
                        bcrypt.hash(newPw, 10, (err, hasPw) => {
                            if(err){
                                LogFile.writeLog('ERROR bcrypt: ' + err);
                            } else {
                                user.TxPassword = hasPw;
                                user.Update(db);
                                socket.emit("mensaje", true);
                            }
                        });
                    });  
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

        socket.on('TestPrenda', () => {
            if(CallAPI.withAccessDB(accessDB)){
                DPrendas.Id(db, 1)
                    .then(function(registro){
                        socket.emit("TEST", registro.getData());
                    });
            }
            else {
                socket.emit('withAccess', false);
            }
        });

        socket.on('TestMenu', () => {
            DMenus.Id(db, 1)
                .then(function(registro){
                    socket.emit("TEST", registro);
                });
        });

        socket.on('TestClosets', (idClosets) => {
            DClosets.Id(db, idClosets)
                .then(function(registro) {
                    if (registro){
                        socket.emit("TEST", registro.getData());
                    } else {
                        socket.emit("TEST", null);
                    }
                });
        });

        socket.on('TestUser', () => {
            DUsers.Id(db, 1)
                .then(function(registro){
                    if (registro){
                        socket.emit("TEST", registro.getData());
                    } else {
                        socket.emit("TEST", null);
                    }
                });
        });

        socket.on('TestParams', () => {
            var params = new DBParams;
            DMenus.Find(db, `AND TX_NAME = ${params.addParams("Inicio")}`, params)
                .then(function(registro){
                    socket.emit("TEST", registro);
                })
        });
        socket.on('TestInsert', () => {
            var newClosets = new DClosets(null, "Calcetines", 1, "Calcetines cortos", 1);
            newClosets.Insert(db)
                .then(function(result){
                    socket.emit("TEST", result.affectedID);
                });
        });
        socket.on('TestUpdate', (idClosets) => {
            DClosets.Id(db, idClosets)
            .then(function(closet){
                closet.CdUser = 10;
                closet.Update(db)
                    .then(function(result) {
                        if (result && result.rows > 0){
                            socket.emit("OK");
                        }
                    });
            });
        });
    }

    static withAccessDB(accessDB){
        return !!accessDB.db;
    }

}

module.exports = CallAPI;