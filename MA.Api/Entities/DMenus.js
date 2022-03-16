const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class DMenus extends RegDB{
    constructor(IdMenu, TxName, CdPath, ChActive, FhCreated, FhModified, CdCreatedBy, CdModifiedBy){
        super();
        this.IdMenu = IdMenu;
        this.TxName = TxName;
        this.CdPath = CdPath;
        this.ChActive = ChActive;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
        this.CdModifiedBy = CdModifiedBy;
        this.CdCreatedBy = CdCreatedBy;
    };

    static TxTable = "D_MENUS";

    static ListFields = {
        IdMenu: new Fields('ID_MENU','Number' ,'PK' , null),
        TxName: new Fields('TX_NAME', 'String', null , null),
        TxPath: new Fields('TX_PATH', 'Number', null , null),
        CdActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
        CdModifiedBy: new Fields('CD_MODIFIED_BY', 'Number', null, null),
        CdCreatedBy: new Fields('CD_CREATED_BY', 'Number', 'IO', null)
    };

}

module.exports = DMenus;