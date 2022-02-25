const DBParams = require("./DBParamas");

class Commands{
    constructor(db, sentencia, param){
        this.db = db;
        this.sentencia = sentencia;
        this.DBParams = param || new DBParams;
    };
    addParams(param, type){
        return this.DBParams.addParams(param, type);
    }

    // TODO: Método de ejecución de consulta mas apto para operaciones insert y update
/**
 * Se obtiene una promesa con el resultado de la consulta almacenada en "sentencia" 
 * y usando el acceso a la base de datos definido en db
 * @returns Lista de los registros.
 */
    ejecutarSentencia(){
        return new Promise((resolve, reject) => {
            var sqlTest = this.DBParams.replaceParams(this.sentencia);
            console.log(sqlTest);
            db.all(sqlTest, (error, row) => {
                resolve(row)
            });
        })
    };
}

module.exports = Commands;