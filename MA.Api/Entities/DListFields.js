const RegDB = require('../Utils/RegDB');
const Fields = require('../Utils/Fields');

class DListFields extends RegDB{
    constructor(IdListField, CdCreatedBy, CdModifiedBy, FhCreated, FhModified, CdList, CdFieldName, TxLabel, ChSortable, CdVariant, TxStyle, ChActive, CdFilterName, TxFilterSql, NuOrder){
        super();
        this.IdListField = IdListField;
        this.CdCreatedBy = CdCreatedBy;
        this.CdModifiedBy = CdModifiedBy;
        this.FhCreated = FhCreated;
        this.FhModified = FhModified;
        this.CdList = CdList;
        this.CdFieldName = CdFieldName;
        this.TxLabel = TxLabel;
        this.ChSortable = ChSortable;
        this.CdVariant = CdVariant;
        this.TxStyle = TxStyle;
        this.ChActive = ChActive;
        this.CdFilterName = CdFilterName;
        this.TxFilterSql = TxFilterSql;
        this.NuOrder = NuOrder;
    };

    static TxTable = 'D_LIST_FIELDS';

    static ListFields = {
        IdListField: new Fields('ID_LIST_FIELD','String' ,'PK' , null),
        CdCreatedBy: new Fields('CD_CREATED_BY', 'Number', 'IO', null),
        CdModifiedBy: new Fields('CD_MODIFIED_BY', 'Number', null, null),
        FhCreated: new Fields('FH_CREATED', 'Date', 'IO', null),
        FhModified: new Fields('FH_MODIFIED', 'Date', null, null),
        CdList: new Fields('CD_LIST', 'String', null , null),
        CdFieldName: new Fields('CD_FIELD_NAME', 'String', null , null),
        TxLabel: new Fields('TX_LABEL', 'String', null , null),
        ChSortable: new Fields('CH_SORTABLE', 'Boolean', null , null),
        CdVariant: new Fields('CD_VARIANT', 'String', null , null),
        TxStyle: new Fields('TX_STYLE', 'String', null , null),
        ChActive: new Fields('CH_ACTIVE', 'Boolean', null, null),
        CdFilterName: new Fields('CD_FILTER_NAME', 'String', null, null),
        TxFilterSql: new Fields('TX_FILTER_SQL', 'String', null, null),
        NuOrder: new Fields('NU_ORDER', 'Number', null, null)
    };
}

module.exports = DListFields;