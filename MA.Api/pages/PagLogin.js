const LogFile = require('../Utils/LogFile');
const bcrypt = require("bcryptjs");
const DUsers = require('../Entities/DUsers');
const DBParams = require('../Utils/DBParamas');
const TokenManager = require('../Utils/TokenManager');


class PagLogin {
    static calls(socket){
        socket.on('LoginIn', async (loginParams) => {
            var params = new DBParams;
            var user = await DUsers.Find(socket.accessDB, 'AND TX_LOGIN = ' + params.addParams(loginParams.login), params);
            if (user){
                if (await bcrypt.compare(loginParams.pw, user[0].TxPassword)){
                    socket.accessDB.user = user[0].IdUser;
                    // PW correcto
                    var token = TokenManager.getToken(user[0].IdUser);                    
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
    }
}

module.exports = PagLogin;