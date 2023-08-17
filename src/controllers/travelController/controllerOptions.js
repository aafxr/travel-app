import constants from "../../static/constants";
import travelModel from "../../modules/Travel/models/travel/travelModel";


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
 * @type{import('../ActionController').OptionsType}
 */
const options = {
    models: {
        travel: () => travelModel,
    },
    storeName: constants.store.TRAVEL_ACTIONS,
}

export default options