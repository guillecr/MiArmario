const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class DUsers extends RegDB{
    constructor(IdUser, TxName, TxLogin, TxPassword, ChActive, FhCreated, FhModified, CdCreatedBy, CdModifiedBy, FhLastLogin){
        super();
        this.IdUser = IdUser;
        this.TxName = TxName;
        this.TxLogin = TxLogin;
        this.TxPassword = TxPassword;
        this.ChActive = ChActive;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
        this.CdModifiedBy = CdModifiedBy;
        this.CdCreatedBy = CdCreatedBy;
        this.FhLastLogin = FhLastLogin;
    };

    static TxTable = 'D_USERS';

    static ListFields = {
        IdUser: new Fields('ID_USER','Number' ,'PK' , null),
        TxName: new Fields('TX_NAME', 'String', null , null),
        TxPassword: new Fields('TX_PASSWORD', 'Number', null , null),
        TxLogin: new Fields('TX_LOGIN', 'String', null , null),
        ChActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
        CdModifiedBy: new Fields('CD_MODIFIED_BY', 'Number', null, null),
        CdCreatedBy: new Fields('CD_CREATED_BY', 'Number', 'IO', null),
        FhLastLogin: new Fields('FH_LAST_LOGIN', 'Date', null, null)
    };
}

module.exports = DUsers;