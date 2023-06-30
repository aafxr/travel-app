import Model from "../../../model/Model";

import limitValidationObj from '../models/limit/validation'
import expensesValidationObj from '../models/expenses/validation'
import sectionValidationObj from '../models/section/validation'

import constants from "../db/constants";












/**@type{import('../../../actionController/ActionController').OptionsType} */
const options = {
    models: {
        limit: (db) => new Model(db, constants.store.SECTION_LIMITS, limitValidationObj),
        expenses_actual: (db) => new Model(db, constants.store.EXPENSES_ACTUAL, expensesValidationObj),
        expenses_plan: (db) => new Model(db, constants.store.EXPENSES_PLANED, expensesValidationObj),
        section: (db) => new Model(db, constants.store.SECTION, sectionValidationObj)
    },
    storeName: 'expensesActions',
    onUpdate,
}

export default options