const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class DProfiles extends RegDB{
    constructor(IdProfile, TxProfile, ChActive, FhCreated, FhModified, CdCreatedBy, CdModifiedBy){
        super();
        this.IdProfile = IdProfile;
        this.TxProfile = TxProfile;
        this.ChActive = ChActive;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
        this.CdModifiedBy = CdModifiedBy;
        this.CdCreatedBy = CdCreatedBy;
    };

    static TxTable = 'D_PROFILES';

    static ListFields = {
        IdProfile: new Fields('ID_PROFILE','Number' ,'PK' , null),
        TxProfile: new Fields('TX_PROFILE', 'String', null , null),
        ChActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
        CdModifiedBy: new Fields('CD_MODIFIED_BY', 'Number', null, null),
        CdCreatedBy: new Fields('CD_CREATED_BY', 'Number', 'IO', null)
    };
}

module.exports = DProfiles;