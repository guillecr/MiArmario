class DBParams{
    constructor(){
        this.listParams = {};
    }

    /**
     * Añadir parametros a una consulta
     * @param {Object} param 
     * @param {String} type 
     * @returns Nombre del parametro
     */
    addParams(param, type, name){
        var nameParam = name || "$PARAM" + Object.keys(this.listParams).length;
        if (!param){
            param = 'NULL';
        }
        this.listParams[nameParam] = param;
        return nameParam;
    }

    /**
     * Obtener los parametros indexados por el nombre del parámetro.
     * @returns Parámetros del objeto
     */
    getParams(){
        return this.listParams || {};
    }
}

module.exports = DBParams;