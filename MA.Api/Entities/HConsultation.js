const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class HConsultation extends RegDB{
    constructor(IdConsultation, TxSql, FhCreated, FhModified, CdCreatedBy, CdModifiedBy){
        super();
        this.IdConsultation = IdConsultation;
        this.TxSql = TxSql;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
        this.CdModifiedBy = CdModifiedBy;
        this.CdCreatedBy = CdCreatedBy;
    };

    static TxTable = 'H_CONSULTATION';

    static ListFields = {
        IdConsultation: new Fields('ID_CONSULTATION','Number' ,'PK' , null),
        TxSql: new Fields('TX_SQL', 'Number', null , null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
        CdModifiedBy: new Fields('CD_MODIFIED_BY', 'Number', null, null),
        CdCreatedBy: new Fields('CD_CREATED_BY', 'Number', 'IO', null)
    };
}

module.exports = HConsultation;