const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class DPrendas extends RegDB{
    constructor(IdPrenda, TxName, CdType, CdState, CdSubstate, NuOrder, ChActive, FhCreated, FhModified, CdCloset, CdCreatedBy, CdModifiedBy){
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
        this.CdModifiedBy = CdModifiedBy;
        this.CdCreatedBy = CdCreatedBy;
    };

    static TxTable = "D_PRENDAS";

    static ListFields = {
        IdPrenda: new Fields('ID_PRENDA','Number' ,'PK' , null),
        TxName: new Fields('TX_NAME', 'String', null , null),
        CdType: new Fields('CD_TYPE', 'Number', null , null),
        CdState: new Fields('CD_STATE', 'Number', null , null),
        CdSubstate: new Fields('CD_SUBSTATE', 'Number', null, null),
        NuOrder: new Fields('NU_ORDER', 'Number', null, null),
        ChActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
        CdCloset: new Fields('CD_CLOSET', 'Number', null, null),
        CdModifiedBy: new Fields('CD_MODIFIED_BY', 'Number', null, null),
        CdCreatedBy: new Fields('CD_CREATED_BY', 'Number', 'IO', null),
        TxState: new Fields('(SELECT P.TX_DESCRIPTION FROM P_LITERAL_VALUES P WHERE P.ID_LITERAL_VALUE = D_PRENDAS.CD_STATE)', 'String', 'RO',null)
    };
}

module.exports = DPrendas;