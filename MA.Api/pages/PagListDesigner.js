const DForms = require('../Entities/DForms');
const DListFields = require('../Entities/DListFields');
const DLists = require('../Entities/DLists');
const DBParams = require('../Utils/DBParamas');
const LogFile = require('../Utils/LogFile');

class PagListDesigner {
    static calls(socket){
        socket.on("PagListDesignerGetListInfo", async(IdList) => {
            try{
                var params = new DBParams;
                var objList = await DLists.Id(socket.accessDB, IdList);
                console.log(objList);
                //var objList = await DListFields.Find(`AND CD_LIST = ${params.addParams(IdList)}`, params)
                socket.emit("PagListDesignerGetListInfoResponse", objList);
            }
            catch(ex) {
                LogFile.writeLog('ERROR - PagListDesignerGetListInfo: ' + ex.message);
            }
        });

    }
}

module.exports = PagListDesigner;