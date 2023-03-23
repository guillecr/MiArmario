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
        if (!type) {
            type = typeof param;
        }
        type = type.toUpperCase();
        
        if (!param){
            if (type == 'STRING'){
                param = '';
            // } else if (type == 'Date') {
            //     param = param.getUTCMilliseconds();
            } else if (type == 'BOOLEAN'){
                param = false; // TODO: Poner false lleva el campo de BD a NULL. Valorar forzar el valor 0
            } else if (type == 'NUMBER'){
                // No modificamos el valor, si es 0 o si es nulo
            } else {
                param = null; // Los campos vacios serán cadenas vacias
            }
            
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