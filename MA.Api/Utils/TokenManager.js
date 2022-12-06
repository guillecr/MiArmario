const jwt = require("jwt-simple");

class TokenManager {
    static authentication(token){
        if (token) {
            try {
                var user = this.checkToken(token);
                return {result: "OK", idUser: user};
            }
            catch(e) {
                if (e.code == "TOKEN_EXPIRE"){
                    return {result: "TOKEN_EXPIRE", idUser: null};
                } else if (e.code == "ERROR"){
                    return {result: "ERROR", message: e.message};
                }
            }
        }
        return {result: "NO_TOKEN", idUser: null};
    }

    static checkToken(token){
        if (!token){
            // No tenemos token
            return null;
        } else { 
            var payload = null;
            try {    
                payload = jwt.decode(token, PARAMS.TOKEN_KEY);
                // TODO: No necesario la comprovación?
                if (payload.exp > (Date.now() / 1000)) {
                    return payload.sub;
                } else {
                    // Token exirado
                    throw {code: "TOKEN_EXPIRE", menssage: null};
                }    
            } catch (ex){
                if (ex.message == "Token expired"){
                    // Token exirado
                    throw {code: "TOKEN_EXPIRE", menssage: null};
                } else {
                    throw {code: "ERROR", menssage: ex.message};
                }
            }
        }
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