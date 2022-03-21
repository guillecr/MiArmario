const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class RProfilesMenus extends RegDB{
    constructor(IdProfilesMenus, CdProfile, CdMenu ,ChActive, FhCreated, FhModified, CdCreatedBy, CdModifiedBy){
        super();
        this.IdProfilesMenus = IdProfilesMenus;
        this.CdProfile = CdProfile;
        this.CdMenu = CdMenu;
        this.ChActive = ChActive;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
        this.CdModifiedBy = CdModifiedBy;
        this.CdCreatedBy = CdCreatedBy;
    };

    static TxTable = 'R_PROFILES_MENUS';

    static ListFields = {
        IdProfilesMenus: new Fields('ID_PROFILES_MENUS','Number' ,'PK' , null),
        CdProfile: new Fields('CD_PROFILE', 'Number', null , null),
        CdMenu: new Fields('CD_MENU', 'Number', null , null),
        ChActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
        CdModifiedBy: new Fields('CD_MODIFIED_BY', 'Number', null, null),
        CdCreatedBy: new Fields('CD_CREATED_BY', 'Number', 'IO', null)
    };
}

module.exports = RProfilesMenus;