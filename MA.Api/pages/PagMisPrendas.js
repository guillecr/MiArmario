const DPrendas = require('../Entities/DPrendas');
const DClosets = require('../Entities/DClosets');
const ExtImgs = require('../Entities/ExtImgs');

const DBParams = require('../Utils/DBParamas');
const CallService = require('../Utils/CallService');
const RPrendasImgs = require('../Entities/RPrendasImgs');

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
                AND CH_PRINCIPAL = 1
                AND CH_ACTIVE = 1`, params);
            if (listImg && listImg.length > 0){
                listPrendas[index].BiImg = 'data:application/octet-stream;base64, ' + listImg[0].BiStream;
                listPrendas[index].CdImg = listImg[0].IdImg;
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

    static async SavePrenda(accessDB, prenda){
        var prendaDb = new DPrendas;
        prendaDb.setObject(prenda);
        var response;
        if (prendaDb.IdPrenda) {
            response = await prendaDb.Update(accessDB);
        } else {
            response = await prendaDb.Insert(accessDB);
        }

        if (prenda.ObjImg){
            prenda.ObjImg.value = prenda.ObjImg.value.split(',')[1];
            var params = new DBParams;
            var listImg = await ExtImgs.Find(accessDB,`AND ID_IMG IN (SELECT R.CD_IMG FROM R_PRENDAS_IMGS R WHERE R.CD_PRENDA = ${prenda.IdPrenda})
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