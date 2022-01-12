const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class DClosets extends RegDB{
    constructor(IdClosets, TxName, CdUser, TxDescription, ChActive, FhCreated, FhModified){
        super();
        this.IdClosets = IdClosets;
        this.TxName = TxName;
        this.CdUser = CdUser;
        this.TxDescription = TxDescription;
        this.ChActive = ChActive;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
    };

    static TxTable = 'D_CLOSETS';

    static ListFields = {
        IdClosets: new Fields('ID_CLOSET','Long' ,'PK' , null),
        TxName: new Fields('TX_NAME', 'String', null , null),
        CdUser: new Fields('CD_USER', 'Long', null , null),
        TxDescription: new Fields('TX_DESCRIPTION', 'String', null , null),
        CdActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
    };
}

module.exports = DClosets;