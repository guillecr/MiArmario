class Param{
    constructor(value, type){
        this.value = value;
        this.type = type;
    }
    static quote = "'";
    getValue(){
        switch (this.type){
            case 'number':
                return this.value;
            case 'boolean':
                return this.value ? 1: 0;
            case 'Date':
                console.log(this.value.getTime())
                return this.value.getTime();
            case 'string':
                return this.constructor.quote + this.value.replace(/'/g,"\"") + this.constructor.quote;  
            default:
                // TODO: Sistema para poder tener parametros de fechas
                console.log(this.type)
        }
    }
}
class DBParams{
    constructor(){
        this.params = [];
    }
    addParams(param, type){
        var NuParam = this.params.length;
        if (!type){
            type = typeof param;
        }
        this.params[NuParam] = new Param(param, type);
        return `:PARAM${NuParam}`;
    }
    replaceParams(sql){
        var indexParam;
        for (var indexParam in this.params){
            sql = sql.replace(`:PARAM${indexParam}`, this.params[indexParam].getValue());
        }
        return sql;
    }
}

module.exports = DBParams;