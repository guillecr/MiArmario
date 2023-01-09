const DListButtons = require('../Entities/DListButtons');
const DListFields = require('../Entities/DListFields');
const DLists = require('../Entities/DLists');
const CallService = require('../Utils/CallService');
const Commands = require('../Utils/Commands');
const DBParams = require('../Utils/DBParamas');

class DynamicList extends CallService {
    static async GetInfo(accessDB, IdList) {
        var dList = await DLists.Id(accessDB, IdList);
        var result = null;
        if (dList) {
            result = {defColumns:[], defButtons:[],selectable: true};
            // Campos
            // TODO: Aplicar orden
            var params = new DBParams;
            var lstFields = await DListFields.Find(accessDB, `AND CD_LIST = ${params.addParams(IdList)} AND NU_ORDER IS NOT NULL AND CH_ACTIVE = 1 ORDER BY NU_ORDER`, params);
            
            // Botones
            // TODO: Aplicar orden
            params = new DBParams;
            var lstButtons = await DListButtons.Find(accessDB, `AND CD_LIST = ${params.addParams(IdList)} AND CH_ACTIVE = 1 ORDER BY NU_ORDER`, params);

            for (var indx in lstFields){
                result.defColumns.push(lstFields[indx]);
            }
            for (var indx in lstButtons){
                result.defButtons.push(lstButtons[indx]);
            }
        }
        return result;
    }

    static async GetValues(accessDB, request) {
        var IdList = request.idList;
        var lstFlt = request.flt;
        // TODO: Propiedad key con la columna definida en la lista como clave
        var list = await DLists.Id(accessDB, IdList);
        var cmd = new Commands();
        cmd.db = accessDB.linkDB;
        cmd.sentencia = list.TxSqlBase;
        if (lstFlt){
            var params = new DBParams;
            var lstFields = await DListFields.Find(accessDB, `AND CD_LIST = ${params.addParams(IdList)} AND TX_FILTER_SQL IS NOT NULL AND CH_ACTIVE = 1`, params);
            for (var i in lstFields){
                var field = lstFields[i];
                for (var j in lstFlt){
                    var filter = lstFlt[j];
                    if (j == field.CdFilterName){
                        // Tenemos definido un filtro
                        cmd.sentencia = cmd.sentencia.replace("--[FILTER]", field.TxFilterSql + '\n--[FILTER]');
                        cmd.addParams(filter, null, "$" + field.CdFilterName);
                    }
                }            
            }
        }
        
        var result = await cmd.ejecutarSentencia();
        return result;
    }
}

module.exports = DynamicList;