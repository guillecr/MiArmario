const DUsers = require('../Entities/DUsers');
const RProfilesUsers = require('../Entities/RProfilesUsers');
const CallService = require('../Utils/CallService');
const bcrypt = require("bcryptjs");

class PagUsers extends CallService {
    static async GetInfo(accessDB, IdUser){
        return await DUsers.Id(accessDB, IdUser);
    }
    static async Save(accessDB, user){
        if (user.TxPasswordUncode){
            user.TxPassword = await bcrypt.hash(user.TxPasswordUncode, 12);
        } else if (!userDB.IdUser){
            // No podemos generar un nuevo usuario sin contraseña
            return false
        }
        var userDB = new DUsers;
        userDB.setObject(user);
        userDB.ChActive = true;
        if (userDB.IdUser){
            return await userDB.Update(accessDB);
        } else {
            return await userDB.Insert(accessDB);
        }
    }
    static async SaveProfile(accessDB, objUserProfile){
        var elm = new RProfilesUsers();
        elm.CdUser = objUserProfile.CdUser;
        elm.CdProfile = objUserProfile.CdProfile;
        elm.ChActive = true;
        elm.IdProfilesUsers = objUserProfile.IdProfilesUsers;
        return await elm.Upset(accessDB);
    }
}


module.exports = PagUsers;