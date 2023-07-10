import Model from "../../../models/Model";

import limitValidationObj from '../models/limit/validation'
import expensesValidationObj from '../models/expenses/validation'
import sectionValidationObj from '../models/section/validation'

import constants from "../db/constants";
import createId from "../../../utils/createId";
import accumulate from "../../../utils/accumulate";
import isString from "../../../utils/validation/isString";


/**
 * возвращает action для новой записи в бд
 * @param {import('../../../controllers/ActionController').ControllerPayloadType} payload должен содержать: storeName, user_id, action, data
 * @returns {import('../../../controllers/ActionController').ActionType}
 */
function createAction(payload) {
    const {storeName, user_id, action, data} = payload
    if (storeName && user_id && action && data) {
        return {
            id: createId(user_id),
            action: action,
            data: JSON.stringify(data),
            entity: storeName,
            datetime: new Date().toISOString(),
            synced: 0,
            uid: createId(user_id)
        }
    } else {
        return {}
    }

}


const totalDefault = {
    updated_at: Date.now(),
    limits: [],
    total_actual: 0,
    total_planed: 0
}


export function onUpdate(primary_entity_id, user_id){
    /**
     *
     * @param {import('../../../controllers/ActionController').ActionController} controller
     * @param {import('../../../controllers/ActionController').ActionType} [action]
     */
    return async function (controller, action) {
        let total = JSON.parse(localStorage.getItem(constants.TOTAL_EXPENSES)) || totalDefault
        let isActionAfterUpdate = true

        if (action) {
            const actionTime = Date.parse(action.datetime) || Number.MIN_SAFE_INTEGER
            total.updated_at > actionTime && (isActionAfterUpdate = false)
        } else {
            isActionAfterUpdate = false
        }

        if (action && action.data && isActionAfterUpdate) {
            let actionData = action.data

            isString(actionData) && (actionData = JSON.parse(action.data))

            if (action.entity === 'expenses_actual') {
                total.total_actual += actionData.value || 0
            } else if (action.entity === 'expenses_plan') {
                total.total_planed += actionData.value || 0

            }

        }


        const expenses_actual = await controller.read({
            storeName: constants.store.EXPENSES_ACTUAL,
            index: constants.indexes.PRIMARY_ENTITY_ID,
            query: 'all'
        })

        const expenses_plan = await controller.read({
            storeName: constants.store.EXPENSES_PLAN,
            index: constants.indexes.PRIMARY_ENTITY_ID,
            query: 'all'
        })

        if (!isActionAfterUpdate) {
            total.total_actual = accumulate(expenses_actual, item => item.value)
            total.total_planed = accumulate(expenses_plan, item => item.value)
        }

        const limitsObj = {}
        expenses_plan.forEach(e => limitsObj[e.section_id] ? limitsObj[e.section_id] += e.value : limitsObj[e.section_id] = e.value)

        let limitsExpenses = await controller.read({
            storeName: constants.store.LIMIT,
            index: constants.indexes.PRIMARY_ENTITY_ID,
            query: 'all'
        })

        const limits = []
        for (let limit of limitsExpenses) {
            const section_id = limit.section_id

            const section = await controller.read({
                storeName: constants.store.SECTION,
                action: 'get',
                id: section_id
            })

            if (limit && limitsObj[section_id] && limit.value < limitsObj[section_id]){
                await controller.write({
                    storeName: constants.store.LIMIT,
                    action: 'edit',
                    index: constants.indexes.SECTION_ID,
                    user_id,
                    data: {...limit, value: limitsObj[section_id]}
                })

                limit = await controller.read({
                    storeName: constants.store.LIMIT,
                    index: constants.indexes.SECTION_ID,
                    query: section_id
                })
            }

            limit && limits.push(
                {
                    section_id,
                    title: section.title,
                    value: limit.value
                }
            )
        }

        total.limits = limits

        total.updated_at = Date.now()
        localStorage.setItem(constants.TOTAL_EXPENSES, JSON.stringify(total))
    }
}


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
    storeName: 'expensesActions',
    newAction: createAction,
}

export default options