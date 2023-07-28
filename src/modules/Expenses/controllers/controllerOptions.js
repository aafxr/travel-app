import Model from "../../../models/Model";

import limitValidationObj from '../models/limit/validation'
import expensesValidationObj from '../models/expenses/validation'
import sectionValidationObj from '../models/section/validation'


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
        limit: (db) => new Model(db, constants.store.LIMIT, limitValidationObj),
        expenses_actual: (db) => new Model(db, constants.store.EXPENSES_ACTUAL, expensesValidationObj),
        expenses_plan: (db) => new Model(db, constants.store.EXPENSES_PLAN, expensesValidationObj),
        section: (db) => new Model(db, constants.store.SECTION, sectionValidationObj)
    },
    storeName: constants.store.EXPENSES_ACTIONS,
}

export default options
