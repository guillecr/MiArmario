const DBParams = require("./DBParamas");

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
        return new Promise((resolve, reject) => {
            db.all(this.sentencia, this.params.getParams(), (error, row) => {
                if (error){
                    console.log("ERROR - Commands.ejecutarSentencia" + error);
                    reject(error);
                } else {
                    resolve(row);
                }
            });
        })
    };

    /**
     * Se obtiene el numero de filas afectadas.
     * @returns Numero de filas afectadas
     */
    ejecutarOperacion(){
        return new Promise((resolve, reject) => {
            this.db.run(this.sentencia, this.params.getParams(), (error, row) => {
                if (error){
                    console.log("ERROR - Commands.ejecutarOperacion: " + error);
                    reject(error);
                } else {
                    // TODO: No se recupera la ID o el número de filas afectadas
                    resolve({ ID: this.db.lastID });
                }
            });
        })
    }
}

module.exports = Commands;