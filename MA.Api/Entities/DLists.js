const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class DLists extends RegDB{
    constructor(IdList, CdCreatedBy, CdModifiedBy, FhCreated, FhModified, TxName, TxPkField, TxSqlBase, TxObservations, ChActive){
        super();
        this.IdList = IdList;
        this.CdCreatedBy = CdCreatedBy;
        this.CdModifiedBy = CdModifiedBy;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
        this.TxName = TxName;
        this.TxPkField = TxPkField;
        this.TxSqlBase = TxSqlBase;
        this.TxObservations = TxObservations;
        this.ChActive = ChActive;
    };

    static TxTable = 'D_LISTS';

    static ListFields = {
        IdList: new Fields('ID_LIST','String' ,'PK' , null),
        CdCreatedBy: new Fields('CD_CREATED_BY', 'Number', 'IO', null),
        CdModifiedBy: new Fields('CD_MODIFIED_BY', 'Number', null, null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
        TxName: new Fields('TX_NAME', 'String', null , null),
        TxPkField: new Fields('TX_PK_FIELD', 'String', null , null),
        TxSqlBase: new Fields('TX_SQL_BASE', 'String', null , null),
        TxObservations: new Fields('TX_OBSERVATIONS', 'String', null , null),
        ChActive: new Fields('CH_ACTIVE', 'Boolean', null, null)
    };
}

module.exports = DLists;