const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class RProfilesUsers extends RegDB{
    constructor(IdProfilesUsers, CdProfile, CdUser ,ChActive, FhCreated, FhModified, CdCreatedBy, CdModifiedBy){
        super();
        this.IdProfilesUsers = IdProfilesUsers;
        this.CdProfile = CdProfile;
        this.CdUser = CdUser;
        this.ChActive = ChActive;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
        this.CdModifiedBy = CdModifiedBy;
        this.CdCreatedBy = CdCreatedBy;
    };

    static TxTable = 'R_PROFILES_USERS';

    static ListFields = {
        IdProfilesUsers: new Fields('ID_PROFILES_USERS','Number' ,'PK' , null),
        CdProfile: new Fields('CD_PROFILE', 'Number', null , null),
        CdUser: new Fields('CD_USER', 'Number', null , null),
        ChActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
        CdModifiedBy: new Fields('CD_MODIFIED_BY', 'Number', null, null),
        CdCreatedBy: new Fields('CD_CREATED_BY', 'Number', 'IO', null)
    };
}

module.exports = RProfilesUsers;