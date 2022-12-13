const DMenus = require("../Entities/DMenus");
const CallService = require("../Utils/CallService");

class PagMenus extends CallService {
    static async GetInfo(accessDB, idMenu){
        var menu = null;
        if (idMenu) {
            menu = await DMenus.Id(accessDB, idMenu);
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