const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class PLiteralValues extends RegDB{
    constructor(IdLiteralValue, CdType, CdValue, TxDescription, ChActive, FhCreated, FhModified, CdCreatedBy, CdModifiedBy){
        super();
        this.IdLiteralValue = IdLiteralValue;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
        this.CdModifiedBy = CdModifiedBy;
        this.CdCreatedBy = CdCreatedBy;
        this.CdType = CdType;
        this.CdValue = CdValue;
        this.TxDescription = TxDescription;
        this.ChActive = ChActive;
    };

    static TxTable = 'P_LITERAL_VALUES';

    static ListFields = {
        IdLiteralValue: new Fields('ID_LITERAL_VALUE','Number' ,'PK' , null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
        CdModifiedBy: new Fields('CD_MODIFIED_BY', 'Number', null, null),
        CdCreatedBy: new Fields('CD_CREATED_BY', 'Number', 'IO', null),
        CdType: new Fields('CD_TYPE', 'String', null , null),
        CdValue: new Fields('CD_VALUE', 'String', null , null),
        TxDescription: new Fields('TX_DESCRIPTION', 'String', null , null),
        ChActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
    };
}

module.exports = PLiteralValues;