const LogFile = require('../Utils/LogFile');

class PagLogin {
    static calls(socket){
        socket.on('LoginIn', async (loginParams) => {
            var params = new DBParams;
            var user = await DUsers.Find(accessDB, 'AND TX_LOGIN = ' + params.addParams(loginParams.login), params);
            if (user){
                if (await bcrypt.compare(loginParams.pw, user[0].TxPassword)){
                    // PW correcto
                    var token = CallAPI.getToken(user[0].IdUser);                    
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
    }
}

module.exports = PagLogin;