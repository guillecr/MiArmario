const LogFile = require('../Utils/LogFile');
const DPrendas = require('../Entities/DPrendas');
const DUsers = require('../Entities/DUsers');
const DMenus = require('../Entities/DMenus');
const DClosets = require('../Entities/DClosets');
const ExtImgs = require('../Entities/ExtImgs');

const Commands = require('../Utils/Commands');
const DBParams = require('../Utils/DBParamas');

class MisPrendas {
    static calls(socket){
        socket.on('PagMisPrendasGetInfo', async(idArmario) => {
            try {
                var params = new DBParams;
                var armario = await DClosets.Id(socket.accessDB, idArmario);
                socket.emit('PagMisPrendasGetInfoArmario', {objArmario: armario});
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
                        //socket.emit('PagMisPrendasGetInfoPrendaImgResponse',{"IdPrenda":prenda.IdPrenda, "BiImg":listImg[0].BiStream})
                    }
                    socket.emit('PagMisPrendasGetInfoPrenda', {"ObjPrenda": listPrendas[index]})
                }
            } catch(ex) {
                LogFile.writeLog('ERROR - PagMisPrendasGetInfo2: ' + ex.message);
            }
            
        });
        socket.on('PagMisPrendasGetInfoOld', async(idArmario) => {
            try {
                // Obtenemos la información del armario
                var params = new DBParams;
                var armario = await DClosets.Id(socket.accessDB, idArmario);
                params = new DBParams;
                var listPrendas = await DPrendas.Find(socket.accessDB,`AND CD_CLOSET = ${params.addParams(idArmario)}
                    AND CH_ACTIVE = 1`, params);
                socket.emit('PagMisPrendasGetInfoResponse', {objArmario: armario, listPrendas: listPrendas});

                // El envío de imagenes se hace de 1 en 1
                for (var index in listPrendas){
                    var prenda = listPrendas[index];
                    var params = new DBParams;
                    var listImg = await ExtImgs.Find(socket.accessDB,`AND ID_IMG IN (SELECT R.CD_IMG FROM R_PRENDAS_IMGS R WHERE R.CD_PRENDA = ${prenda.IdPrenda})
                        AND CH_ACTIVE = 1`, params);
                    if (listImg && listImg.length > 0){
                        socket.emit('PagMisPrendasGetInfoPrendaImgResponse',{"IdPrenda":prenda.IdPrenda, "BiImg":listImg[0].BiStream})
                    }
                }


            } catch(ex) {
                LogFile.writeLog('ERROR - PagMisPrendasGetInfo: ' + ex.message);
            }
        });

        socket.on('PagMisPrendasGetListArmarios', async () => {
            try {
                var params = new DBParams;
                var listArmarios = await DClosets.Find(socket.accessDB, `AND CD_USER = ${params.addParams(socket.accessDB.user)}`, params);
                var response = [];
                for (var elm in listArmarios){
                    response.push({"value":listArmarios[elm].IdClosets, "text":listArmarios[elm].TxName});
                }
                socket.emit('PagMisPrendasGetListArmariosResponse', response);
            } catch(ex) {
                LogFile.writeLog('ERROR - PagMisPrendasGetListArmarios: ' + ex.message);
            }
        });
    }
}

module.exports = MisPrendas;