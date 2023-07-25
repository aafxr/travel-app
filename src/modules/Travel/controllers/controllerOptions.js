import Model from "../../../models/Model";
import constants from "../db/constants";
import travelValidation from "../models/travel/validation";
import createAction from "../../../utils/createAction";


/**
 * @description эти опции используются при создании экземпляра ActionController
 *
 *
 * models - объект ключи которого должны совпадать с именем хранидищ в бд
 * значения -> функции, которые должны возвращать экзепляр Model
 *
 * storeName - имя хранилища для записи не синхронизированных action
 *
 * newAction - функция, должна возвращать action на основе переданной в контроллер информации из методов read, write
 *
 * @type{import('../../../controllers/ActionController').OptionsType}
 */
const options = {
    models: {
        travel: (db) => new Model(db, constants.store.TRAVEL, travelValidation),
    },
    storeName: constants.store.TRAVEL_ACTIONS,
    newAction: createAction,
}

export default options