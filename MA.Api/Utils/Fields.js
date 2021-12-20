class Fields{
    constructor(TxColumnName, CdType, CdUsing, ObjValue){
        this.TxColumnName = TxColumnName;
        this.CdType = CdType;
        if (TxColumnName.indexOf('.') >= 0 || TxColumnName.indexOf(' ') >= 0) {
            this.CdUsing = "RO";
        } else {
            this.CdUsing = CdUsing;
        };
    };

    setFieldValue(list, IdField, value) {
        for(column in list){
            if (column == IdField){
                list.ObjValue = value;
            }
        }
    };
};

module.exports = Fields;