const CallService = require('../Utils/CallService');
const DForms = require('../Entities/DForms');

class PagFormDesigner extends CallService{
    static async GetInfo(accessDB, idForm){
        var frm = await DForms.Id(accessDB, idForm);
        return frm;
    }
    static async Save(accessDB, frm){
        var frmDB = new DForms;
        frmDB.setObject(frm);
        return await frmDB.Upset(accessDB);
    }
}

module.exports = PagFormDesigner;