const LogFile = require('../Utils/LogFile');
const DPrendas = require('../Entities/DPrendas');
const DClosets = require('../Entities/DClosets');
const ExtImgs = require('../Entities/ExtImgs');

const DBParams = require('../Utils/DBParamas');

class MisPrendas {
    static calls(socket){
        socket.on('PagMisPrendas.GetInfo', async(idArmario) => {
            try {
                var params = new DBParams;
                var armario = await DClosets.Id(socket.accessDB, idArmario);
                params = new DBParams;
                var listPrendas = await DPrendas.Find(socket.accessDB,`AND CD_CLOSET = ${params.addParams(idArmario)}
                    AND CH_ACTIVE = 1`, params);
                for (var index in listPrendas){
                    var prenda = listPrendas[index];
                    var params = new DBParams;
                    var listImg = await ExtImgs.Find(socket.accessDB,`AND ID_IMG IN (SELECT R.CD_IMG FROM R_PRENDAS_IMGS R WHERE R.CD_PRENDA = ${prenda.IdPrenda})
                        AND CH_ACTIVE = 1`, params);
                    if (listImg && listImg.length > 0){
                        listPrendas[index].BiImg = 'data:image/jpeg;base64, ' + listImg[0].BiStream;
                    }
                }
                socket.emit('PagMisPrendas.GetInfo.Response', {"objArmario": armario, "lstPrenda": listPrendas});
            } catch(ex) {
                LogFile.writeLog('ERROR - PagMisPrendas.GetInfo: ' + ex.message);
            }
            
        });
        socket.on('PagMisPrendas.GetListArmarios', async () => {
            try {
                var params = new DBParams;
                var listArmarios = await DClosets.Find(socket.accessDB, `AND CD_USER = ${params.addParams(socket.accessDB.user)}`, params);
                var response = [];
                for (var elm in listArmarios){
                    response.push({"value":listArmarios[elm].IdClosets, "text":listArmarios[elm].TxName});
                }
                socket.emit('PagMisPrendas.GetListArmarios.Response', response);
            } catch(ex) {
                LogFile.writeLog('ERROR - PagMisPrendas.GetListArmarios: ' + ex.message);
            }
        });
        socket.on('PagMisPrendas.GetInfoPrenda', async (idPrenda) => {
            try{
                socket.emit('PagMisPrendas.GetInfoPrenda.Response', await DPrendas.Id(socket.accessDB, idPrenda));
            } catch(ex) {
                LogFile.writeLog('ERROR - PagMisPrendas.GetInfoPrenda: ' + ex.message);
            }
        })
    }
}

module.exports = MisPrendas;