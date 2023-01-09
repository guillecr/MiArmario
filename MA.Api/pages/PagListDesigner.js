const DLists = require('../Entities/DLists');
const CallService = require('../Utils/CallService');
const DListFields = require('../Entities/DListFields');
const DListButtons = require('../Entities/DListButtons');

class PagListDesigner extends CallService {
    static async GetListInfo(accessDB, IdList) {
          return await DLists.Id(accessDB, IdList);
    }
    static async GetFieldInfo(accessDB, IdListField) {
          return await DListFields.Id(accessDB, IdListField);
    }
    static async GetButtonInfo(accessDB, IdListButton){
          return await DListButtons.Id(accessDB, IdListButton);
    }

    static async SaveButton(accessDB, button){
          var buttonDB= new DListButtons;
          buttonDB.setObject(button);
          if (buttonDB.IdListButton) {
               return await buttonDB.Update(accessDB);
          } else {
               return await buttonDB.Insert(accessDB);
          }
     }

    static async Save(accessDB, lst) {
          var listDB = new DLists;
          listDB.setObject(lst);
          var result = await listDB.Upset(accessDB);
          return result.IdList;
    }

     static async SaveField(accessDB, field){
          var fieldDB = new DListFields;
          fieldDB.setObject(field);
          if (fieldDB.IdListField) {
               return await fieldDB.Update(accessDB);
          } else {
               return await fieldDB.Insert(accessDB);
          }
     }
}

module.exports = PagListDesigner;