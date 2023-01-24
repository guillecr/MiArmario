const DMenus = require("../Entities/DMenus");
const CallService = require("../Utils/CallService");

class PagMenus extends CallService {
    static async GetInfo(accessDB, CdComponent){
        var menu = null;
        if (CdComponent) {
            menu = await DMenus.Id(accessDB, CdComponent);
        }
        return menu;
    }
    static async Save(accessDB, objMenu){
        var menu = new DMenus;
        menu.setObject(objMenu);
        return await menu.Upset(accessDB);
    }

}

module.exports = PagMenus