const DLists = require('../Entities/DLists');
const CallService = require('../Utils/CallService');

class PagListDesigner extends CallService {
    static async GetListInfo(accessDB, IdList) {
         return await DLists.Id(accessDB, IdList);
    }
    static async Save(accessDB, lst) {
        var listDB = new DLists;
        listDB.setObject(lst);
        var result = await listDB.Upset(accessDB);
        return result.IdList;
   }
}

module.exports = PagListDesigner;