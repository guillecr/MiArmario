class RegDB{
    TxSelect_(DicKey){
        var sql = "";
        var where = "";
        var sepWhere = "\nWHERE ";
        var sep = "SELECT \n";
        for (var column in this.ListFields){
            console.log(this.ListFields[column]);
            if (this.ListFields[column].CdUsing == 'PK'){
                console.log(column)
                where += sepWhere + this.ListFields[column].TxColumnName + '=' + DicKey[column];
                sepWhere = '\nAND ';
            } else {
            sql += sep + this.ListFields[column].TxColumnName;
            sep = '\n,';
            }
        }
        return sql + '\nFROM ' + this.TxTable + where
    };
    TxUpdate(){
        var sql = 'UPDATE ' + this.TxTable + 'SET \n';
        var sep = "";
        for (campo in this){
            if (this.ListFields.indexOf(campo) && (this.ListFields[campo].CdUsing != 'RO') || this.ListFields[campo].CdUsing != 'IO'){
                sql += sep + this.ListFields[campo].TxColumnName + ' = ' + this[campo];
                sep = '\n,';
            }
        }
    }
};

module.exports = RegDB;