const Commands = require("./Commands");

class RegDB{
    constructor(){}

    static ListFields = {};
    /**
     * Método para obtener un diccionario de las ID con sus valores del objeto
     * @returns Collección de IDs con sus valores
     */
    getId(){
        var dicIDs = {};
        for(var i in this.ListFields){
            if (this.constructor.ListFields[i].CdUsing == 'PK'){
                dicIDs[i] = this[i];
            }
        }
        return dicIDs;
    };

    /**
     * Método genérico para setear la ID del objeto. Solo actualiza la primera ID
     * @param CdId Valor de la nueva ID
     */
    setId(CdId){
        // TODO: Solo es valido si existe una sola PK.
        for(var i in this.constructor.ListFields){
            if (this.constructor.ListFields[i].CdUsing == 'PK'){
                this[i] = CdId;
                break;
            }
        }
    };

    /**
     * Método para sincronizar un objeto o colección con la del objeto
     * @param source Fuente de datos a sincronizar
     */
    setObject(source){
        for (var index in source){
            this[index] = source[index];
        }
    };

    /**
     * Método para setear los campos del objeto haciendo referencia al nombre de la columna
     * @param source Fuente de datos.
     */
    setColumns(source){
        for(var camp in this.constructor.ListFields){
            var column = this.constructor.ListFields[camp].TxColumnName;
            this[camp] = source[column];
        }
    };

    /**
     * Método para obtener los datos propios de la entidad
     * @returns Colección de datos
     */
    getData(){
        var dicData = {};
        for(var camp in this.constructor.ListFields){
            dicData[camp] = this[camp];
        }
        return dicData;
    }

    /**
     * Método que devuelve una promesa en la que cuando se cumple, el objeto se ha actualizado con la ID indicada
     * @param db Acceso a la base de datos
     * @param idValue ID del registro
     * @returns Resultado de la lectura
     */
    Read(db, idValue){
        var cm = this;
        cm.setId(idValue);
        return new Promise((resolve, reject) => {
            var cmd = new Commands(db, cm.constructor.TxSelect(idValue));
            cmd.ejecutarSentencia()
                .then(function(row){
                    cm.setColumns(row[0]);
                    resolve(cm);
                }).catch(function(err){
                    console.log("ERROR READ: " + err);
                })
        });
    };

    /**
     * Método estatico para obtener la entidad del registro buscado
     * @param db Acceso a la base de datos
     * @param idValue ID de la entidad a buscar
     * @returns Promesa con el resultado de la busqueda
     */
    static Id(db, idValue){
        var reg = new this(idValue);
        return reg.Read(db, idValue);
    }

    /**
     * Método interno para recuperar todas los registros de una entidad
     * @param db Acceso a la base de datos
     * @param TxWhere Condiciones de búsqueda
     * @returns Lista de registros
     */
    static Find(db, TxWhere, params){
        var cm = this;
        return new Promise((resolve, reject) => {
            var cmd = new Commands(db, cm.TxSelect(null, TxWhere), params);
            cmd.ejecutarSentencia()
                .then(function(rows){
                    var registros = [];
                    for (var index in rows){
                        var tmp = new cm();
                        tmp.setColumns(rows[index]);
                        registros.push(tmp);
                    }
                    resolve(registros);
                });
        })
    };

    /**
     * Calcula la consulta SQL que debe de ejecutarse para realizar una consulta de tipo Select.
     * @param DicKey ID del registro a buscar. Si no se indica, se generará la consulta para obtener todos.
     * @param whereExtra String con mas condiciónes where
     * @returns String con la consulta.
     */
    static TxSelect(DicKey, whereExtra){
        var sql = "";
        var where = "";
        var sepWhere = "\nWHERE ";
        var sep = "SELECT \n";
        for (var column in this.ListFields){
            if (this.ListFields[column].CdUsing == 'PK' && (DicKey && DicKey[column])){
                where += sepWhere + this.ListFields[column].TxColumnName + '=' + DicKey[column];
                sepWhere = '\nAND ';
            }
            sql += sep + this.ListFields[column].TxColumnName;
            sep = '\n,';
        }
        if (whereExtra){
            if (where == ""){
                // Sustituimos el primer AND por el WHERE si no se ha formado ningún filtro
                whereExtra = whereExtra.replace("AND", sepWhere);
            }
            where += whereExtra;
        }
        return sql + '\nFROM ' + this.TxTable + where
    };

    /**
     * TODO:
     * Calcula la consulta SQL que debe de ejecutarse para realizar una consulta de tipo UPDATE.
     */
    TxUpdate(){
        var sql = 'UPDATE ' + this.TxTable + 'SET \n';
        var sep = "";
        for (campo in this){
            if (this.ListFields.indexOf(campo) && (this.ListFields[campo].CdUsing != 'RO') || this.ListFields[campo].CdUsing != 'IO'){
                sql += sep + this.ListFields[campo].TxColumnName + ' = ' + this[campo];
                sep = '\n,';
            }
        }
    };

};

module.exports = RegDB;