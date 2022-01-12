class Commands{
    constructor(db, sentencia){
        this.db = db;
        this.sentencia = sentencia;
    };

/**
 * Se obtiene una promesa con el resultado de la consulta almacenada en "sentencia" 
 * y usando el acceso a la base de datos definido en db
 * @returns Lista de los registros.
 */
    ejecutarSentencia(){
        return new Promise((resolve, reject) => {
            db.all(this.sentencia, (error, row) => {
                resolve(row)
            });
        })
    };
}

module.exports = Commands;