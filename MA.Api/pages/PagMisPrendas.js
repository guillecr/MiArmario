const DPrendas = require('../Entities/DPrendas');
const DClosets = require('../Entities/DClosets');
const ExtImgs = require('../Entities/ExtImgs');

const PLiteralValues = require('../Entities/PLiteralValues')

const DBParams = require('../Utils/DBParamas');
const CallService = require('../Utils/CallService');
const RPrendasImgs = require('../Entities/RPrendasImgs');

class PagMisPrendas extends CallService {
    static async GetInfo(accessDB, request){
        var idArmario = request.idArmario;
        var lstFltState;
        var lstFltSubstate;
        if (request.flt){
            var lstFltState = request.flt.lstStates;
            var lstFltSubstate = request.flt.lstSubstates; 
        }
        var params = new DBParams;
        var armario = await DClosets.Id(accessDB, idArmario);
        params = new DBParams;
        var where = `AND CD_CLOSET = ${params.addParams(idArmario)}
AND CH_ACTIVE = 1`
        var sep = "\nAND CD_STATE IN ("
        if (lstFltState && lstFltState.length > 0) {
            for (var i = 0; i < lstFltState.length; i++) {
                where += sep + params.addParams(lstFltState[i]);
                sep = ',';
            }
            where += ')';
        }
        var sep = "\nAND CD_SUBSTATE IN ("
        if (lstFltSubstate && lstFltSubstate.length > 0) {
            for (var i = 0; i < lstFltSubstate.length; i++) {
                where += sep + params.addParams(lstFltSubstate[i]);
                sep = ',';
            }
            where += ')';
        }
        var listPrendas = await DPrendas.Find(accessDB, where, params);
        for (var index in listPrendas){
            var prenda = listPrendas[index];
            var params = new DBParams;
            var listImg = await ExtImgs.Find(accessDB,`AND ID_IMG IN (SELECT R.CD_IMG FROM R_PRENDAS_IMGS R WHERE R.CD_PRENDA = ${prenda.IdPrenda})
                AND CH_PRINCIPAL = 1
                AND CH_ACTIVE = 1`, params);
            if (listImg && listImg.length > 0){
                listPrendas[index].BiImg = 'data:application/octet-stream;base64, ' + listImg[0].BiStream;
                listPrendas[index].CdImg = listImg[0].IdImg;
            }
        }
        return {"objArmario": armario, "lstPrenda": listPrendas};
    }

    static async GetFilters(accessDB){
        var result = {
            lstStates: [],
            lstSubstates: []
        };
        var params = new DBParams;
        var literalsState = await PLiteralValues.Find(accessDB, `AND CD_TYPE IN ('ESTADO_PRENDA', 'SUB_ESTADO_PRENDA')`, params)
        for (var i = 0; i < literalsState.length; i++){
            var literal = literalsState[i];
            if (literal.CdType == 'ESTADO_PRENDA'){
                result.lstStates.push(literal);
            } else {
                result.lstSubstates.push(literal);
            }
        }
        return result;
    }

    static async GetListArmarios(accessDB){
        var params = new DBParams;
        var listArmarios = await DClosets.Find(accessDB, `AND CD_USER = ${params.addParams(accessDB.user)}`, params);
        var response = [];
        for (var elm in listArmarios){
            response.push({"value":listArmarios[elm].IdCloset, "text":listArmarios[elm].TxName});
        }
        return response;
    }

    static async GetInfoPrenda(accessDB, idPrenda) {
        return await DPrendas.Id(accessDB, idPrenda);
    }

    static async DeletePrenda(accessDB, idPrenda){
        var prendaDb = await DPrendas.Id(accessDB, idPrenda);
        prendaDb.ChActive = false;
        var result = await prendaDb.Update(accessDB);
        return result == 1;
    }

    static async SavePrenda(accessDB, prenda){
        var prendaDb = new DPrendas;
        prendaDb.setObject(prenda);
        var response;
        if (prendaDb.IdPrenda && prendaDb.IdPrenda > 0) {
            response = await prendaDb.Update(accessDB);
        } else {
            prendaDb.ChActive = true;
            response = await prendaDb.Insert(accessDB);
        }

        if (prenda.ObjImg){
            prenda.ObjImg.value = prenda.ObjImg.value.split(',')[1];
            var params = new DBParams;
            var listImg = await ExtImgs.Find(accessDB,`AND ID_IMG IN (SELECT R.CD_IMG FROM R_PRENDAS_IMGS R WHERE R.CD_PRENDA = ${prendaDb.IdPrenda})
                AND CH_PRINCIPAL = 1
                AND CH_ACTIVE = 1`, params);
            
            if (listImg && listImg.length > 0) {
                var img = listImg[0];
                img.BiStream = prenda.ObjImg.value;
                img.Update(accessDB);
            } else {
                var img = new ExtImgs();
                img.ChActive = true;
                img.ChPrincipal = true;
                img.BiStream = prenda.ObjImg.value;
                img.IdImg = await img.Insert(accessDB);
                var rImgPrenda = new RPrendasImgs();
                rImgPrenda.CdImg = img.IdImg;
                rImgPrenda.CdPrenda = prendaDb.IdPrenda;
                rImgPrenda.ChActive = true;
                await rImgPrenda.Insert(accessDB);
            }
        }
        
         return response;
    }
}

module.exports = PagMisPrendas;