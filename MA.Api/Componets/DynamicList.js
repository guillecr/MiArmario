const DForms = require('../Entities/DForms');
const DListFields = require('../Entities/DListFields');
const DLists = require('../Entities/DLists');
const Commands = require('../Utils/Commands');
const DBParams = require('../Utils/DBParamas');
const LogFile = require('../Utils/LogFile');

class DynamicList {
    static calls(socket){
        socket.on("DynamicListGetInfo", async(IdList) => {
            try{
                var dList = await DLists.Id(socket.accessDB, IdList);
                var result = {defColumns:[], selectable: true};
                if (dList) {
                    var params = new DBParams;
                    var lstListFields = await DListFields.Find(socket.accessDB, `AND CD_LIST = ${params.addParams(IdList)} AND CH_ACTIVE = 1`, params);
                    for (var indx in lstListFields){
                        var elm = lstListFields[indx];
                        result.defColumns.push(elm);
                    }
                    socket.emit("DynamicListGetInfoResponse", result);
                }
            }
            catch(ex) {
                LogFile.writeLog('ERROR - DynamicListGetInfo: ' + ex.message);
            }
        });
        socket.on("DynamicListGetValues", async(IdList, flt) => {
            try{
                // TODO: Propiedad key con la columna definida en la lista como clave
                var list = await DLists.Id(socket.accessDB, IdList);
                var cmd = new Commands();
                cmd.db = socket.accessDB.linkDB;
                cmd.sentencia = list.TxSqlBase;
                var result = await cmd.ejecutarSentencia();
                socket.emit("DynamicListGetValuesResponse", result);
            }
            catch(ex) {
                LogFile.writeLog('ERROR - DynamicListGetValues: ' + ex.message);
            }
        });
    }
}

module.exports = DynamicList;