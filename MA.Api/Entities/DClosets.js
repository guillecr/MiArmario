const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class DClosets extends RegDB{
    constructor(IdClosets, TxName, CdUser, TxDescription, ChActive, FhCreated, FhModified, CdCreatedBy, CdModifiedBy){
        super();
        this.IdClosets = IdClosets;
        this.TxName = TxName;
        this.CdUser = CdUser;
        this.TxDescription = TxDescription;
        this.ChActive = ChActive;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
        this.CdModifiedBy = CdModifiedBy;
        this.CdCreatedBy = CdCreatedBy;
    };

    static TxTable = 'D_CLOSETS';

    static ListFields = {
        IdClosets: new Fields('ID_CLOSET','Number' ,'PK' , null),
        TxName: new Fields('TX_NAME', 'String', null , null),
        CdUser: new Fields('CD_USER', 'Number', null , null),
        TxDescription: new Fields('TX_DESCRIPTION', 'String', null , null),
        ChActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
        CdModifiedBy: new Fields('CD_MODIFIED_BY', 'Number', null, null),
        CdCreatedBy: new Fields('CD_CREATED_BY', 'Number', 'IO', null)
    };
}

module.exports = DClosets;