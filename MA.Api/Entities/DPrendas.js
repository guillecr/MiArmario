const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class DPrendas extends RegDB{
    constructor(IdPrenda, TxName, CdType, CdState, CdSubstate, NuOrder, CdActive, FhCreate, FhModify, CdCloset){
        super();
        this.TxTable = 'D_PRENDAS';
        this.IdPrenda = IdPrenda;
        this.TxName = TxName;
        this.CdType = CdType;
        this.CdState = CdState;
        this.CdSubstate = CdSubstate;
        this.NuOrder = NuOrder;
        this.CdActive = CdActive;
        this.FhCreate = FhCreate;
        this.FhModify = FhModify;
        this.CdCloset = CdCloset;
        // Fields.setFieldValue(this.ListFields, 'IdPrenda', IdPrenda);    
        // Fields.setFieldValue(this.ListFields, 'TxName', TxName);
        // Fields.setFieldValue(this.ListFields, 'CdType', CdType);
        // Fields.setFieldValue(this.ListFields, 'CdState', CdState);
        // Fields.setFieldValue(this.ListFields, 'CdSubstate', CdSubstate);
        // Fields.setFieldValue(this.ListFields, 'NuOrder', NuOrder);
        // Fields.setFieldValue(this.ListFields, 'CdActive', CdActive);
        // Fields.setFieldValue(this.ListFields, 'FhCreate', FhCreate);
        // Fields.setFieldValue(this.ListFields, 'FhModify', FhModify);
        // Fields.setFieldValue(this.ListFields, 'CdCloset', CdCloset);
    };
    ListFields = {
        IdPrenda: new Fields('ID_PRENDA','Long' ,'PK' , null),
        TxName: new Fields('TX_NAME', 'String', null , null),
        CdState: new Fields('CD_STATE', 'Long', null , null),
        CdSubstate: new Fields('CD_SUBSTATE', 'Long', null, null),
        NuOrder: new Fields('NU_ORDER', 'Long', null, null),
        CdActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
        FhCreate: new Fields('FH_CREATE', 'Date', 'IO', null),
        FhModify: new Fields('FH_MODIFY', 'Date', null, null),
        CdCloset: new Fields('CD_CLOSET', 'Long', null, null)
    };
    TxSelect(){
        return this.TxSelect_({IdPrenda:this.IdPrenda});
    }
}

module.exports = DPrendas;