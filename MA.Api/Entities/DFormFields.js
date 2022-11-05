const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class DFormFields extends RegDB{
    constructor(IdFormField,
        ChActive,
        FhCreated,
        FhModified,
        CdCreatedBy,
        CdModifiedBy,
        CdForm,
        NuPosY,
        NuPosX,
        NuWidth,
        NuHeight,
        NuWidthLabel,
        CdType,
        TxLabel,
        CdField,
        TxColumnName,
        TxDisabled,
        TxVisible,
        TxSqlList,
        TxObservations
    ){
        super();
        this.IdFormField = IdFormField;
        this.ChActive = ChActive;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
        this.CdModifiedBy = CdModifiedBy;
        this.CdCreatedBy = CdCreatedBy;
        this.CdForm = CdForm;
        this.NuPosY = NuPosY;
        this.NuPosX = NuPosX;
        this.NuWidth = NuWidth;
        this.NuWidthLabel = NuWidthLabel;
        this.NuHeight = NuHeight;
        this.CdType = CdType;
        this.TxLabel = TxLabel;
        this.CdField = CdField;
        this.TxColumnName = TxColumnName;
        this.TxDisabled = TxDisabled;
        this.TxVisible = TxVisible;
        this.TxSqlList = TxSqlList;
        this.TxObservations = TxObservations;
    };

    static TxTable = 'D_FORM_FIELDS';

    static ListFields = {
        IdFormField: new Fields('ID_FORM_FIELD','Number' ,'PK' , null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
        CdModifiedBy: new Fields('CD_MODIFIED_BY', 'Number', null, null),
        CdCreatedBy: new Fields('CD_CREATED_BY', 'Number', 'IO', null),
        ChActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
        CdForm: new Fields('CD_FORM', 'String', null, null),
        NuPosY: new Fields('NU_POSY', 'Number', null, null),
        NuPosX: new Fields('NU_POSX', 'Number', null, null),
        NuWidth: new Fields('NU_WIDTH', 'Number', null, null),
        NuWidthLabel: new Fields('NU_WIDTH_LABEL', 'Number', null, null),
        NuHeight: new Fields('NU_HEIGHT', 'Number', null, null),
        CdType: new Fields('CD_TYPE', 'String', null, null),
        TxLabel: new Fields('TX_LABEL', 'String', null, null),
        CdField: new Fields('CD_FIELD', 'String', null, null),
        TxColumnName: new Fields('TX_COLUMN_NAME', 'String', null, null),
        TxDisabled: new Fields('TX_DISABLED', 'String', null, null),
        TxVisible: new Fields('TX_VISIBLE', 'String', null, null),
        TxSqlList: new Fields('TX_SQL_LIST', 'String', null, null),
        TxObservations: new Fields('TX_OBSERVATIONS', 'String', null , null)
    };
}

module.exports = DFormFields;