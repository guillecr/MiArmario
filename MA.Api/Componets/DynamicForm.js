const DFormFields = require('../Entities/DFormFields');
const Commands = require('../Utils/Commands');
const DBParams = require('../Utils/DBParamas');
const LogFile = require('../Utils/LogFile');

class DynamicForm {
    static calls(socket){
        socket.on("DynamicFormGetInfo", async(IdForm) => {
            try{
                var params = new DBParams
                var listFields = await DFormFields.Find(socket.accessDB, `AND CD_FORM = ${params.addParams(IdForm)} AND CH_ACTIVE = 1`, params);
                for (var i in listFields){
                    var elm = listFields[i];
                    if (elm.CdType == 'LST'){
                        var params = new DBParams
                        var cmd = new Commands(socket.accessDB.linkDB, elm.TxSqlList, params);
                        var result = await cmd.ejecutarSentencia();
                        elm.ListFill = [];
                        for (var indx in result){
                            var row = result[indx];
                            var elmList = {};
                            for (var j = 0; j < 2; j++){
                                elmList[j] = row[Object.keys(row)[j]];
                            }
                            elm.ListFill.push({"value": elmList[0], "text": elmList[1]});
                        }
                    }
                }
                socket.emit("DynamicFormGetInfoResponse", listFields);
            }
            catch(ex) {
                LogFile.writeLog('ERROR - DynamicFormGetInfo: ' + ex.message);
            }
        });

        socket.on("DynamicFormSaveForm", async(req) => {
            // TODO: Asignación de valores muy bruta. Mejorarlo para hacerlo dinamico
            try{
                if (req && req.CdForm && req.ctrls && req.ctrls.length > 0 ) {
                    for (var indx in req.ctrls){
                        var ctrl = req.ctrls[indx];
                        var newField = new DFormFields;
                        newField.CdForm = req.CdForm;
                        newField.CdType = ctrl.CdType;
                        newField.NuHeight = ctrl.NuHeight;
                        newField.NuWidth = ctrl.NuWidth;
                        newField.NuPosX = ctrl.NuPosX;
                        newField.NuPosY = ctrl.NuPosY;
                        newField.NuWidthLabel = ctrl.NuWidthLabel;
                        newField.TxLabel = ctrl.TxLabel;
                        newField.TxVisible = ctrl.TxVisible;
                        newField.TxDisabled = ctrl.TxDisabled;
                        newField.CdField = ctrl.CdField;
                        newField.TxSqlList = ctrl.TxSqlList;
                        newField.ChActive = true;
                        if (ctrl.IdFormField) {
                            newField.IdFormField = ctrl.IdFormField;
                            newField.Update(socket.accessDB);
                        } else {
                            newField.Insert(socket.accessDB);
                        }
                    }
                }
                socket.emit("DynamicFormSaveFormRespone", true);
            }
            catch(ex) {
                LogFile.writeLog('ERROR - DynamicFormSaveForm: ' + ex.message);
            }
        });

        socket.on("DynamicFormGetListFill", async(IdFormField) => {
            try{
                console.log(IdFormField);
                if (IdFormField) {
                    var elm = await DFormFields.Id(socket.accessDB, IdFormField);
                    if (elm && elm.TxSqlList && elm.TxSqlList.startsWith("SELECT ")) {
                        // TODO: Permitir incluir un parámetro a sustituir para hacer listas dependientes
                        var params = new DBParams
                        var cmd = new Commands(socket.accessDB.linkDB, elm.TxSqlList, params);
                        var result = await cmd.ejecutarSentencia();
                        var listFill = [];
                        for (var indx in result){
                            var row = result[indx];
                            var elm = {};
                            for (var j = 0; j < 2; j++){
                                elm[j] = row[Object.keys(row)[j]];
                            }
                            listFill.push({"value": elm[0], "text": elm[1]});
                        }
                        socket.emit("DynamicFormGetListFillResponse", {"IdFormField": IdFormField, "ListFill": listFill});
                    }
                }
            } catch(ex) {
                LogFile.writeLog('ERROR - DynamicFormGetListFill: ' + ex.message);
            }
        })
    }
}

module.exports = DynamicForm;