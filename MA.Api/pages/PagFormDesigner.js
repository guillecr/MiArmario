const DForms = require('../Entities/DForms');
const LogFile = require('../Utils/LogFile');

class PagFormDesigner {
    static calls(socket){
        socket.on("PagFormDesignerGetListForms", async() => {
            try{
                var listForms = await DForms.Find(socket.accessDB, `AND CH_ACTIVE = 1`);
                var listShow = [];
                for (const elm in listForms){
                    listShow.push({
                        'IdFormulario':listForms[elm].IdForm,
                        'Nombre': listForms[elm].TxName
                    });
                }
                socket.emit("PagFormDesignerGetListFormsResponse", listShow);
            }
            catch(ex) {
                LogFile.writeLog('ERROR - PagFormDesignerGetListForms: ' + ex.message);
            }
        });

    }
}

module.exports = PagFormDesigner;