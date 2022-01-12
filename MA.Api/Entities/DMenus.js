const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class DMenus extends RegDB{
    constructor(IdMenu, TxName, CdPath, ChActive, FhCreated, FhModified){
        super();
        this.IdMenu = IdMenu;
        this.TxName = TxName;
        this.CdPath = CdPath;
        this.ChActive = ChActive;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
    };

    static TxTable = "D_MENUS";

    static ListFields = {
        IdMenu: new Fields('ID_MENU','Long' ,'PK' , null),
        TxName: new Fields('TX_NAME', 'String', null , null),
        TxPath: new Fields('TX_PATH', 'Long', null , null),
        CdActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
    };

}

module.exports = DMenus;