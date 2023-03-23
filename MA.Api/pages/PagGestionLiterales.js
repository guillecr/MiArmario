const CallService = require('../Utils/CallService');
const PLiteralValues = require('../Entities/PLiteralValues');

class PagGestionLiterales extends CallService{
    static async GetInfo(accessDB, IdLiteralValue){
        var literal = await PLiteralValues.Id(accessDB, IdLiteralValue);
        return literal;
    }
    static async Save(accessDB, literal){
        var literalDB = new PLiteralValues;
        literalDB.setObject(literal);
        if (literalDB.IdLiteralValue){
            return await literalDB.Update(accessDB);
        } else {
            return await literalDB.Insert(accessDB);
        }
    }
}

module.exports = PagGestionLiterales;