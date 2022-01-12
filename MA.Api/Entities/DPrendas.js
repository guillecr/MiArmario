const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class DPrendas extends RegDB{
    constructor(IdPrenda, TxName, CdType, CdState, CdSubstate, NuOrder, ChActive, FhCreated, FhModified, CdCloset){
        super();
        this.IdPrenda = IdPrenda;
        this.TxName = TxName;
        this.CdType = CdType;
        this.CdState = CdState;
        this.CdSubstate = CdSubstate;
        this.NuOrder = NuOrder;
        this.ChActive = ChActive;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
        this.CdCloset = CdCloset;
    };

    static TxTable = "D_PRENDAS";

    static ListFields = {
        IdPrenda: new Fields('ID_PRENDA','Long' ,'PK' , null),
        TxName: new Fields('TX_NAME', 'String', null , null),
        CdState: new Fields('CD_STATE', 'Long', null , null),
        CdSubstate: new Fields('CD_SUBSTATE', 'Long', null, null),
        NuOrder: new Fields('NU_ORDER', 'Long', null, null),
        ChActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
        CdCloset: new Fields('CD_CLOSET', 'Long', null, null)
    };
}

module.exports = DPrendas;