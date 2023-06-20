const jwt = require("jwt-simple");

class TokenManager {
    static checkToken(token){
        var response = null
        if (token) { 
            var payload = null;
            try {    
                payload = jwt.decode(token, PARAMS.TOKEN_KEY);
                // TODO: Se puede quitar ya que la decodificación del token mirá la valided por fecha
                if (payload.exp > (Date.now() / 1000)) {
                    response = {result: "OK", idUser: payload.sub};
                } else {
                    // Token expirado
                    response = {result: "TOKEN_EXPIRE", menssage: null};
                }    
            } catch (ex){
                if (ex.message == "Token expired"){
                    // Token expirado
                    response = {result: "TOKEN_EXPIRE", menssage: null};
                } else {
                    response = {result: "ERROR", menssage: ex.message};
                }
            }
        }
        return response;
    }

    static getToken(idUser){
        var dateNow = Math.floor(Date.now() / 1000);
        var fechEnd = dateNow + PARAMS.TIME_TOKEN_SESIONS;
        var payload = {
            sub: idUser,
            iat: dateNow,
            exp: fechEnd,
        };
        return jwt.encode(payload, PARAMS.TOKEN_KEY);
    }
}

module.exports = TokenManager;