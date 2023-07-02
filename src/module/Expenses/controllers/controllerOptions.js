import Model from "../../../model/Model";

import limitValidationObj from '../models/limit/validation'
import expensesValidationObj from '../models/expenses/validation'
import sectionValidationObj from '../models/section/validation'

import constants from "../db/constants";
import createId from "../../../utils/createId";
import accumulate from "../../../utils/accumulate";
import distinctValues from "../../../utils/distinctValues";
import isString from "../../../utils/validation/isString";


/**
 *
 * @param {import('../../../actionController/ActionController').ControllerPayloadType} payload
 * @returns {import('../../../actionController/ActionController').ActionType}
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
            synced: 1,
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


export function onUpdate(primary_entity_id){
    /**
     *
     * @param {import('../../../actionController/ActionController').ActionController} controller
     * @param {import('../../../actionController/ActionController').ActionType} [action]
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


        if (!isActionAfterUpdate) {
            const expenses_actual = await controller.read({
                storeName: constants.store.EXPENSES_ACTUAL,
                index: constants.indexes.PRIMARY_ENTITY_ID,
                query: IDBKeyRange.only(primary_entity_id)
            })

            const expenses_plan = await controller.read({
                storeName: constants.store.EXPENSES_PLAN,
                index: constants.indexes.PRIMARY_ENTITY_ID,
                query: IDBKeyRange.only(primary_entity_id)
            })


            total.total_actual += accumulate(expenses_actual, item => item.value)
            total.total_planed += accumulate(expenses_plan, item => item.value)

            /**@type {string[]}*/
            const sections_ids = distinctValues(expenses_plan, item => item.section_id)


            const limits = []
            for (const section_id of sections_ids) {
                const section = await controller.read({
                    storeName: constants.store.SECTION,
                    action: 'get',
                    id: section_id
                })

                const limit = await controller.read({
                    storeName: constants.store.LIMIT,
                    index: constants.indexes.SECTION_ID,
                    query: section_id
                })

                limit && limits.push(
                    {
                        section_id,
                        title: section.title,
                        value: limit.value
                    }
                )
            }
        }

        total.updated_at = Date.now()
        localStorage.setItem(constants.TOTAL_EXPENSES, JSON.stringify(total))
    }
}


/**@type{import('../../../actionController/ActionController').OptionsType} */
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