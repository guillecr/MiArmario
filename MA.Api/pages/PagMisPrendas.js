const DPrendas = require('../Entities/DPrendas');
const DClosets = require('../Entities/DClosets');
const ExtImgs = require('../Entities/ExtImgs');

const DBParams = require('../Utils/DBParamas');
const CallService = require('../Utils/CallService');

class PagMisPrendas extends CallService {
    static async GetInfo(accessDB, idArmario){
        var params = new DBParams;
        var armario = await DClosets.Id(accessDB, idArmario);
        params = new DBParams;
        var listPrendas = await DPrendas.Find(accessDB,`AND CD_CLOSET = ${params.addParams(idArmario)}
            AND CH_ACTIVE = 1`, params);
        for (var index in listPrendas){
            var prenda = listPrendas[index];
            var params = new DBParams;
            var listImg = await ExtImgs.Find(accessDB,`AND ID_IMG IN (SELECT R.CD_IMG FROM R_PRENDAS_IMGS R WHERE R.CD_PRENDA = ${prenda.IdPrenda})
                AND CH_ACTIVE = 1`, params);
            if (listImg && listImg.length > 0){
                listPrendas[index].BiImg = 'data:image/jpeg;base64, ' + listImg[0].BiStream;
            }
        }
        return {"objArmario": armario, "lstPrenda": listPrendas};
    }

    static async GetListArmarios(accessDB){
        var params = new DBParams;
        var listArmarios = await DClosets.Find(accessDB, `AND CD_USER = ${params.addParams(accessDB.user)}`, params);
        var response = [];
        for (var elm in listArmarios){
            response.push({"value":listArmarios[elm].IdClosets, "text":listArmarios[elm].TxName});
        }
        return response;
    }

    static async GetInfoPrenda(accessDB, idPrenda) {
        return await DPrendas.Id(accessDB, idPrenda);
    }
}

module.exports = PagMisPrendas;