const DFormFields = require('../Entities/DFormFields');
const DBParams = require('../Utils/DBParamas');
const LogFile = require('../Utils/LogFile');

class DynamicForm {
    static calls(socket){
        socket.on("DynamicFormGetInfo", async(IdForm) => {
            try{
                var params = new DBParams
                var listFields = await DFormFields.Find(socket.accessDB, `AND CD_FORM = ${params.addParams(IdForm)} AND CH_ACTIVE = 1`, params);
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
                        newField.CdField = socket.CdField;
                        newField.ChActive = true;
                        if (ctrl.IdFormFields) {
                            newField.IdFormFields = ctrl.IdFormFields;
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
    }
}

module.exports = DynamicForm;