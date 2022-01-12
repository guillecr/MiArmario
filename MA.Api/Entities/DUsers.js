const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class DUsers extends RegDB{
    constructor(IdUser, TxName, TxLogin, TxPassword, ChActive, FhCreated, FhModified){
        super();
        this.IdUser = IdUser;
        this.TxName = TxName;
        this.TxLogin = TxLogin;
        this.TxPassword = TxPassword;
        this.ChActive = ChActive;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
    };

    static TxTable = 'D_USERS';

    static ListFields = {
        IdUser: new Fields('ID_USER','Long' ,'PK' , null),
        TxName: new Fields('TX_NAME', 'String', null , null),
        TxPassword: new Fields('TX_PASSWORD', 'Long', null , null),
        TxLogin: new Fields('TX_LOGIN', 'String', null , null),
        CdActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
    };
}

module.exports = DUsers;