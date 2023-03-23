const DUsers = require('../Entities/DUsers');
const CallService = require('../Utils/CallService');
const bcrypt = require("bcryptjs");

class PagChangePw extends CallService {
    static async ChangePw(accessDB, request){
        var result = false;
        if (request && request.TxPwOld && request.TxPwNew){
            var user = await DUsers.Id(accessDB, accessDB.user);
            if (await bcrypt.compare(request.TxPwOld, user.TxPassword)){
                user.TxPassword = await bcrypt.hash(request.TxPwNew, 12);
                if (await user.Update(accessDB) > 0) {
                    result = true;
                }
            }
        }
        return result
    }
}

module.exports = PagChangePw;