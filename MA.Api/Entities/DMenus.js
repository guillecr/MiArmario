const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class DMenus extends RegDB{
    constructor(CdComponent, TxName, CdPath, ChActive, FhCreated, FhModified, CdCreatedBy, CdModifiedBy, NuOrder){
        super();
        this.TxName = TxName;
        this.CdPath = CdPath;
        this.ChActive = ChActive;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
        this.CdModifiedBy = CdModifiedBy;
        this.CdCreatedBy = CdCreatedBy;
        this.CdComponent = CdComponent;
        this.NuOrder = NuOrder;
    };

    static TxTable = "D_MENUS";

    static ListFields = {
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
        CdCreatedBy: new Fields('CD_CREATED_BY', 'Number', 'IO', null),
        CdModifiedBy: new Fields('CD_MODIFIED_BY', 'Number', null, null),
        TxName: new Fields('TX_NAME', 'String', null , null),
        TxPath: new Fields('TX_PATH', 'Number', null , null),
        ChActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
        CdComponent: new Fields('CD_COMPONENT', 'String', 'PK', null),
        NuOrder: new Fields('NU_ORDER', 'Number', null, null)
    };

}

module.exports = DMenus;