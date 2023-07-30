import {expensesPlanModel,expensesActualModel} from "../models/expenses/expensesModel";
import limitModel from "../models/limit/limitModel";
import sectionModel from "../models/section/sectionModel";


import constants from "../../../static/constants";





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
        limit: () => limitModel,
        expenses_actual: () => expensesActualModel,
        expenses_plan: () =>expensesPlanModel,
        section: () => sectionModel
    },
    storeName: constants.store.EXPENSES_ACTIONS,
}

export default options
