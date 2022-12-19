const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class DListButtons extends RegDB{
    constructor(IdListButton, CdCreatedBy, CdModifiedBy, FhCreated, FhModified, CdList, TxLabel, TxAction, TxStyle, ChActive, CdVariant){
        super();
        this.IdListButton = IdListButton;
        this.CdCreatedBy = CdCreatedBy;
        this.CdModifiedBy = CdModifiedBy;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
        this.CdList = CdList;
        this.TxLabel = TxLabel;
        this.TxAction = TxAction;
        this.TxStyle = TxStyle;
        this.ChActive = ChActive;
        this.CdVariant = CdVariant;
    };

    static TxTable = 'D_LIST_BUTTONS';

    static ListFields = {
        IdListButton: new Fields('ID_LIST_BUTTON','Number' ,'PK' , null),
        CdCreatedBy: new Fields('CD_CREATED_BY', 'Number', 'IO', null),
        CdModifiedBy: new Fields('CD_MODIFIED_BY', 'Number', null, null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
        CdList: new Fields('CD_LIST', 'String', null , null),
        TxLabel: new Fields('TX_LABEL', 'String', null , null),
        TxAction: new Fields('TX_ACTION', 'String', null , null),
        TxStyle: new Fields('TX_STYLE', 'String', null , null),
        ChActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
        CdVariant: new Fields('CD_VARIANT', 'String', null , null),
    };
}

module.exports = DListButtons;