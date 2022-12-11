const DLists = require('../Entities/DLists');
const DBParams = require('../Utils/DBParamas');
const LogFile = require('../Utils/LogFile');

class PagListDesigner {
    static calls(socket){
        socket.on("PagListDesigner.GetListInfo", async(IdList) => {
            try{
                //var params = new DBParams;
                var objList = await DLists.Id(socket.accessDB, IdList);
                //var objList = await DListFields.Find(`AND CD_LIST = ${params.addParams(IdList)}`, params)
                socket.emit("PagListDesigner.GetListInfo.Response", objList);
            }
            catch(ex) {
                LogFile.writeLog('ERROR - PagListDesigner.GetListInfo: ' + ex.message);
            }
        });
        socket.on("PagListDesigner.Save", async(lst) => {
            try{
                var listDB = new DLists;
                listDB.setObject(lst);
                var result = await listDB.Upset(socket.accessDB);
                socket.emit("PagListDesigner.Save.Response", result.IdList);
            }
            catch(ex) {
                LogFile.writeLog('ERROR - PagListDesigner.Save: ' + ex.message);
                socket.emit("PagListDesigner.Save.Response", false);
            }
        });

    }
}

module.exports = PagListDesigner;