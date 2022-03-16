const Commands = require("./Commands");
const DBParamas = require("./DBParamas");
const LogFile = require("./LogFile");

class RegDB{
    constructor(){}

    static ListFields = {};
    /**
     * Método para obtener un diccionario de las ID con sus valores del objeto
     * @returns Colección de IDs con sus valores
     */
    getId(){
        var dicIDs = {};
        for(var i in this.constructor.ListFields){
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
    Read(accessDB, idValue){
        var cm = this;
        if (idValue){
            cm.setId(idValue);
        }
        return new Promise((resolve, reject) => {
            var params = new DBParamas();
            var cmd = new Commands(accessDB.db, cm.constructor.TxSelect(this.getId(), params), params);
            cmd.ejecutarSentencia()
                .then(function(row){
                    if (row.length > 0){
                        cm.setColumns(row[0]);
                        resolve(cm);
                    } else {
                        resolve(null);
                    }
                }).catch(function(err){
                    LogFile.writeLog("ERROR READ: " + err);
                })
        });
    };

    /**
     * Método estatico para obtener la entidad del registro buscado
     * @param db Acceso a la base de datos
     * @param idValue ID de la entidad a buscar
     * @returns Promesa con el resultado de la busqueda
     */
    static Id(accessDB, idValue){
        var reg = new this(idValue);
        return reg.Read(accessDB.db);
    }

    /**
     * Método interno para recuperar todas los registros de una entidad
     * @param db Acceso a la base de datos
     * @param TxWhere Condiciones de búsqueda
     * @returns Lista de registros
     */
    static Find(accessDB, TxWhere, params){
        var cm = this;
        return new Promise((resolve, reject) => {
            var cmd = new Commands(accessDB.db, cm.TxSelect(null, null, TxWhere), params);
            cmd.ejecutarSentencia()
                .then(function(rows){
                    var registros = [];
                    for (var index in rows){
                        var tmp = new cm();
                        tmp.setColumns(rows[index]);
                        registros.push(tmp);
                    }
                    resolve(registros);
                }).catch(function(err){
                    LogFile.writeLog("ERROR FIND: " + err);
                });
        })
    };

    /**
     * Inserta el registro definido en el objeto.
     * @param db Acceso a la base de datos.
     * @returns ID del nuevo registro.
     */
    Insert(accessDB){
        var cm = this;
        return new Promise((resolve, reject) => {
            var params = new DBParamas();
            var cmd = new Commands(accessDB.db, cm.TxInsert(accessDB.user, params), params);
            cmd.ejecutarOperacion()
                .then(async function(rows){
                    await cm.Read(accessDB, rows.affectedID);
                    resolve(rows.affectedID);
                })
                .catch(function(err){
                    LogFile.writeLog("ERROR INSERT: " + err);
                });
        });
    };

    /**
     * Actualización del registro definido en el objeto, creando el where con la ID del objeto.
     * @param accessDB Acceso a la base de datos. 
     * @returns Numero de filas afectadas.
     */
    Update(accessDB){
        var cm = this;
        return new Promise((resolve, reject) => {
            var params = new DBParamas();
            var cmd = new Commands(accessDB.db, cm.TxUpdate(accessDB.user, params), params);
            cmd.ejecutarOperacion()
                .then(async function(rows){
                    await cm.Read(accessDB);
                    resolve(rows.rows);
                }).catch(function(err){
                    LogFile.writeLog("ERROR UPDATE: " + err);
                });
        })
    }

    /**
     * Calcula la consulta SQL que debe de ejecutarse para realizar una consulta de tipo Select.
     * @param DicKey ID del registro a buscar. Si no se indica, se generará la consulta para obtener todos.
     * @param whereExtra String con mas condiciónes where
     * @returns String con la consulta.
     */
    static TxSelect(DicKey, params, whereExtra){
        var sql = "";
        var where = "";
        var sepWhere = "\nWHERE ";
        var sep = "SELECT \n";
        for (var column in this.ListFields){
            if (this.ListFields[column].CdUsing == 'PK' && (DicKey && DicKey[column])){
                where += `${sepWhere} ${this.ListFields[column].TxColumnName} = ${params.addParams(DicKey[column])}`;
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
     * Calcula la consulta SQL que debe de ejecutarse para realizar una consulta de tipo UPDATE.
     * @param CdUser Usuario que realiza la operación
     * @param params Manejador de parámetros
     * @returns String con la consulta
     */
    TxUpdate(CdUser, params){
        var sql = 'UPDATE ' + this.constructor.TxTable + ' SET \n';
        var sep = "";
        var TxWhere = "\nWHERE";
        var sepWhere = "";
        var listColumns = this.constructor.ListFields;
        for (var column in listColumns){
            if (listColumns[column].CdUsing == 'PK'){
                TxWhere += `${sepWhere} ${listColumns[column].TxColumnName} = ${params.addParams(this[column])}`;
                sepWhere = "\n AND ";
            }
            else if (listColumns[column].CdUsing != 'RO' && listColumns[column].CdUsing != 'IO'){
                if (listColumns[column].TxColumnName == 'FH_MODIFIED'){
                    // La falta de triggers hace que tenga que hacer aquí la operación de manejo de estas columnas
                    sql += `${sep} ${listColumns[column].TxColumnName} = ${params.addParams(new Date())}`;
                } else if (listColumns[column].TxColumnName == 'CD_MODIFIED_BY'){
                    // Auditoria de modificado por
                    sql += `${sep} ${listColumns[column].TxColumnName} = ${params.addParams(CdUser)}`;

                } else {
                    sql += `${sep} ${listColumns[column].TxColumnName} = ${params.addParams(this[column])}`;
                }
                sep = '\n,';
            }
        }
        return sql + TxWhere;
    };

    /**
     * Calcula la consulta SQL que debe de ejecutarse para realizar una consulta de tipo INSERT.
     * @param CdUser Usuario que realiza la operación
     * @param params Manejador de parámetros
     * @returns Consulta SQL de insercción
     */
    TxInsert(CdUser, params){
        var sep = "";
        var sql = "INSERT INTO " + this.constructor.TxTable + " (\n";
        var TxColumn = "";
        var TxValues = "";
        var listColumns = this.constructor.ListFields;
        for (var column in listColumns){
            if (listColumns[column].CdUsing != 'RO' && listColumns[column].CdUsing != 'UO'){
                TxColumn += sep + listColumns[column].TxColumnName;
                if (listColumns[column].TxColumnName == 'FH_MODIFIED' || listColumns[column].TxColumnName == 'FH_CREATED'){
                    // La falta de triggers hace que tenga que hacer aquí la operación de manejo de estas columnas
                    TxValues += sep + params.addParams(new Date());

                } else if (listColumns[column].TxColumnName == 'CD_CREATED_BY' || listColumns[column].TxColumnName == 'CD_MODIFIED_BY'){
                    // Auditoria de creado y modificado por
                    TxValues += sep + params.addParams(CdUser);
                    
                } else {
                    // TODO: El manejo de nulos ya se hace en el manejador de parámetros
                    TxValues += sep + (this[column]? params.addParams(this[column]) : "NULL");
                }
                sep = "\n,";
            }
        }
        return sql + TxColumn + ")\nVALUES\n(" + TxValues + ")";
    };

};

module.exports = RegDB;