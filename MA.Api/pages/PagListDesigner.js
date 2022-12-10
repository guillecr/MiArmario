const DLists = require('../Entities/DLists');
const DBParams = require('../Utils/DBParamas');
const LogFile = require('../Utils/LogFile');

class PagListDesigner {
    static calls(socket){
        socket.on("PagListDesignerGetListInfo", async(IdList) => {
            try{
                //var params = new DBParams;
                var objList = await DLists.Id(socket.accessDB, IdList);
                //var objList = await DListFields.Find(`AND CD_LIST = ${params.addParams(IdList)}`, params)
                socket.emit("PagListDesignerGetListInfoResponse", objList);
            }
            catch(ex) {
                LogFile.writeLog('ERROR - PagListDesignerGetListInfo: ' + ex.message);
            }
        });
        socket.on("PagListDesignerSave", async(lst) => {
            try{
                var listDB = new DLists;
                listDB.setObject(lst);
                var result = await listDB.Upset(socket.accessDB);
                socket.emit("PagListDesignerSaveResponse", result.IdList);
            }
            catch(ex) {
                LogFile.writeLog('ERROR - PagListDesignerSave: ' + ex.message);
                socket.emit("PagListDesignerSaveResponse", false);
            }
        });

    }
}

module.exports = PagListDesigner;