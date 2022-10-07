const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class DForms extends RegDB{
    constructor(IdForm, TxName, TxObservations, ChActive, FhCreated, FhModified, CdCreatedBy, CdModifiedBy){
        super();
        this.IdForm = IdForm;
        this.TxName = TxName;
        this.TxObservations = TxObservations;
        this.ChActive = ChActive;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
        this.CdModifiedBy = CdModifiedBy;
        this.CdCreatedBy = CdCreatedBy;
    };

    static TxTable = 'D_FORMS';

    static ListFields = {
        IdForm: new Fields('ID_FORM','String' ,'PK' , null),
        TxName: new Fields('TX_NAME', 'String', null , null),
        TxObservations: new Fields('TX_OBSERVATIONS', 'String', null , null),
        ChActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
        CdModifiedBy: new Fields('CD_MODIFIED_BY', 'Number', null, null),
        CdCreatedBy: new Fields('CD_CREATED_BY', 'Number', 'IO', null)
    };
}

module.exports = DForms;