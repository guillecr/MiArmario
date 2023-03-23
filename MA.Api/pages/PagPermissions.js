const CallService = require("../Utils/CallService");
const DProfiles = require('../Entities/DProfiles');
const DMenus = require('../Entities/DMenus');
const RProfilesMenus = require('../Entities/RProfilesMenus');
const DBParams = require("../Utils/DBParamas");
const Commands = require("../Utils/Commands");

class PagPermissions extends CallService {
    static async GetProfilesInfo(accessDB){
        var response = [];
        var lstProfiles = await DProfiles.Find(accessDB, "AND CH_ACTIVE = 1", new DBParams);
        for (var i = 0; i < lstProfiles.length; i++){
            var profile = lstProfiles[i];
            response.push({"value": profile.IdProfile, "text": profile.TxProfile});
        }
        return response;
    }
    static async GetPermissons(accessDB, IdProfile){
        var params = new DBParams;
        var lstPermissons = await RProfilesMenus.Find(accessDB, `AND CD_PROFILE = ${params.addParams(IdProfile)} AND CH_ACTIVE = 1`, params);
        var response = [];
        for (var i = 0; i < lstPermissons.length; i++){
            response.push(lstPermissons[i].CdMenu);
        }
        return response;
    }
    static async GetMenusInfo(accessDB){
        var lstMenus = await DMenus.Find(accessDB, "AND CH_ACTIVE = 1", new DBParams);
        var response = [];
        for (var i = 0; i < lstMenus.length; i++){
            var menu = lstMenus[i];
            response.push({"CdMenu": menu.CdComponent, "TxName": menu.TxName});
        }
        return response;
    }
    static async Save(accessDB, request){
        var cmd = new Commands(accessDB.linkDB);
        cmd.sentencia = `UPDATE R_PROFILES_MENUS
            SET CH_ACTIVE = 0
                ,CD_MODIFIED_BY = ${cmd.addParams(accessDB.user)}
                ,FH_MODIFIED = ${cmd.addParams(Date.now())}
            WHERE CD_PROFILE = ${cmd.addParams(request.IdProfile)}
                AND CH_ACTIVE = 1`
        await cmd.ejecutarOperacion();
        var lstPermissions = request.lstPermissions;
        for (var i = 0; i < lstPermissions.length; i++){
            var CdMenu = lstPermissions[i];
            cmd = new Commands(accessDB.linkDB);
            cmd.sentencia = `SELECT ID_PROFILES_MENUS "IdProfilesMenus"
                FROM R_PROFILES_MENUS
                WHERE CD_PROFILE = ${cmd.addParams(request.IdProfile)}
                    AND CD_MENU = ${cmd.addParams(CdMenu)}`;
            var resultSql = await cmd.ejecutarSentencia();
            var elm = new RProfilesMenus();
            elm.IdProfilesMenus = (resultSql[0])? resultSql[0].IdProfilesMenus: null;
            elm.CdProfile = request.IdProfile;
            elm.CdMenu = CdMenu;
            elm.ChActive = true;
            elm.Upset(accessDB);
        }
        return true;
    }
}

module.exports = PagPermissions;