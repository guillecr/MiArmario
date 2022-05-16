class MisPrendas {
    static calls(){
        socket.on('getPrendasByArmario', async(idArmario) => {
            try {
                var params = new DBParams;
                var listPrendas = await DPrendas.Find(accessDB,`AND CD_CLOSET = ${params.addParams(idArmario)}
                    AND CH_ACTIVE = 1`, params);
                // Emitimos la lista de ropa
                socket.emit('getPrendasByArmarioResponse',listPrendas);
                // De uno en uno emitimos las imagenes
                for (var index in listPrendas){
                    var prenda = listPrendas[index];
                    var params = new DBParams;
                    var listImg = await ExtImgs.Find(accessDB,`AND ID_IMG IN (SELECT R.CD_IMG FROM R_PRENDAS_IMGS R WHERE R.CD_PRENDA = ${prenda.IdPrenda})
                        AND CH_ACTIVE = 1`, params);
                    if (listImg && listImg.length > 0){
                        socket.emit('getPrendasByArmarioImgResponse',{"IdPrenda":prenda.IdPrenda, "BiImg":listImg[0].BiStream})
                    }
                }
                
            } catch(ex) {
                LogFile.writeLog('ERROR - getPrendasByArmario: ' + ex.message);
            }
        });
    }
}

module.exports = MisPrendas;