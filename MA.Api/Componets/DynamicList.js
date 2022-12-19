const DListButtons = require('../Entities/DListButtons');
const DListFields = require('../Entities/DListFields');
const DLists = require('../Entities/DLists');
const CallService = require('../Utils/CallService');
const Commands = require('../Utils/Commands');
const DBParams = require('../Utils/DBParamas');
const LogFile = require('../Utils/LogFile');

class DynamicList extends CallService {
    static async GetInfo(accessDB, IdList) {
        var dList = await DLists.Id(accessDB, IdList);
        var result = null;
        if (dList) {
            result = {defColumns:[], defButtons:[],selectable: true};
            // Campos
            var params = new DBParams;
            var lstFields = await DListFields.Find(accessDB, `AND CD_LIST = ${params.addParams(IdList)} AND CH_ACTIVE = 1`, params);
            
            // Botones
            params = new DBParams;
            var lstButtons = await DListButtons.Find(accessDB, `AND CD_LIST = ${params.addParams(IdList)} AND CH_ACTIVE = 1`, params);

            for (var indx in lstFields){
                result.defColumns.push(lstFields[indx]);
            }
            for (var indx in lstButtons){
                result.defButtons.push(lstButtons[indx]);
            }
        }
        return result;
    }

    static async GetValues(accessDB, IdList) {
        // TODO: Propiedad key con la columna definida en la lista como clave
        var list = await DLists.Id(accessDB, IdList);
        var cmd = new Commands();
        cmd.db = accessDB.linkDB;
        cmd.sentencia = list.TxSqlBase;
        var result = await cmd.ejecutarSentencia();
        return result;
    }
}

module.exports = DynamicList;