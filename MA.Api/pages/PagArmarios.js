const DClosets = require('../Entities/DClosets');
const CallService = require('../Utils/CallService');

class PagArmarios extends CallService {
    static async GetInfo(accessDB, IdCloset){
        var result = null;
        if (IdCloset) {
            result = await DClosets.Id(accessDB, IdCloset);
        }
        return result;
    }
    static async Save(accessDB, closet){
        var dCloset = new DClosets();
        dCloset.setObject(closet);
        dCloset.ChActive = true;
        dCloset.CdUser = accessDB.user;
        return await dCloset.Upset(accessDB);
    }
}


module.exports = PagArmarios;