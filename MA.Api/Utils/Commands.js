const DBParams = require("./DBParamas");
const LogFile = require("./LogFile");

class Commands{
    constructor(db, sentencia, params){
        this.db = db;
        this.sentencia = sentencia;
        this.params = params || new DBParams;
    };

    /**
     * Añadir parametros a una consulta
     * @param {Object} param 
     * @param {String} type 
     * @returns Nombre del parametro
     */
    addParams(param, type){
        return this.params.addParams(param, type);
    }

    /**
     * Se obtiene una promesa con el resultado de la consulta almacenada en "sentencia" 
     * y usando el acceso a la base de datos definido en db
     * @returns Lista de los registros.
     */
    ejecutarSentencia(){
        var cm = this;
        return new Promise((resolve, reject) => {
            this.db.all(this.sentencia, this.params.getParams(), (error, row) => {
                if (error){
                    LogFile.writeLog('ERROR - Commands.ejecutarSentencia ' + error);
                    reject(error);
                } else {
                    cm.saveAuditory();
                    resolve(row);
                }
            });
        })
    };

    /**
     * Ejecución de bloques de sentencia. Indicado para los procesos de insercción y actyualización de datos.
     * @returns Objeto con la ID afectada (ID) y con el numero de filas afectadas (rows)
     */
    ejecutarOperacion(){
        var cm = this;
        return new Promise((resolve, reject) => {
            this.db.run(this.sentencia, this.params.getParams(), function(error) {
                if (error){
                    LogFile.writeLog("ERROR - Commands.ejecutarOperacion: " + error);
                    reject(error);
                } else {
                    cm.saveAuditory();
                    resolve({ affectedID: this.lastID, rows: this.changes });
                }
            });
        })
    }

    /**
     * Auditoria de las consultas ejecutadas
     */
    saveAuditory(){
        var audiParams = new DBParams;
        var TxSqlAuditory = this.sentencia;
        for (var partParam in this.params.getParams()){
            TxSqlAuditory = TxSqlAuditory.replace(partParam, this.params.getParams()[partParam]);
        }
        var sql = `
        INSERT INTO H_CONSULTATION 
            (FH_CREATED
            ,FH_MODIFIED
            ,CD_CREATED_BY
            ,CD_MODIFIED_BY
            ,TX_SQL) 
        VALUES 
            (${audiParams.addParams(Date.now())}
            ,${audiParams.addParams(Date.now())}
            ,3 -- API_AUDIT
            ,3 -- API_AUDIT
            ,${audiParams.addParams(TxSqlAuditory)})`
        this.db.run(sql, audiParams.getParams(), function(error) {
            if (error){
                LogFile.writeLog("ERROR - Commands.saveAuditory: " + error);
            }
        });
        
    }
}

module.exports = Commands;