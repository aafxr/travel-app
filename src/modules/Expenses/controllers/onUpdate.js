import constants from "../db/constants";
import isString from "../../../utils/validation/isString";
import accumulate from "../../../utils/accumulate";
import toArray from "../../../utils/toArray";
import createId from "../../../utils/createId";

const totalDefault = {
    updated_at: Date.now(),
    limits: [],
    total_actual: 0,
    total_planed: 0
}


export function onUpdate(primary_entity_id, user_id) {
    /**
     *
     * @param {import('../../../controllers/ActionController').ActionController} controller
     * @param {import('../../../controllers/ActionController').ActionType} [action]
     */
    return async function (controller) {

        // let total = JSON.parse(localStorage.getItem(constants.TOTAL_EXPENSES)) || totalDefault
        // let isActionAfterUpdate = true

        // if (action) {
        //     const actionTime = Date.parse(action.datetime) || Number.MIN_SAFE_INTEGER
        //     total.updated_at < actionTime && (isActionAfterUpdate = false)
        // } else {
        //     isActionAfterUpdate = false
        // }

        // if (action && action.data && isActionAfterUpdate) {
        //     let actionData = action.data
        //
        //     isString(actionData) && (actionData = JSON.parse(action.data))
        //
        //     if (action.entity === 'expenses_actual') {
        //         total.total_actual += actionData.value || 0
        //     } else if (action.entity === 'expenses_plan') {
        //         total.total_planed += actionData.value || 0
        //
        //     }
        //
        // }


        // const expenses_actual = await controller.read({
        //     storeName: constants.store.EXPENSES_ACTUAL,
        //     index: constants.indexes.PRIMARY_ENTITY_ID,
        //     query: 'all'
        // })

        const expenses_plan = await controller.read({
            storeName: constants.store.EXPENSES_PLAN,
            index: constants.indexes.PRIMARY_ENTITY_ID,
            query: 'all'
        })


        // if (!isActionAfterUpdate) {
        //     total.total_actual = accumulate(expenses_actual, item => item.value)
        //     total.total_planed = accumulate(expenses_plan, item => item.value)
        // }

        const limitsObj = {
            personal: {},
            common: {}
        }

        //подсчет запланированных персональных расходов
        expenses_plan
            .filter(e => e.personal === 1 && e.user_id === user_id)
            .forEach(e => limitsObj.personal[e.section_id] ? limitsObj.personal[e.section_id] += e.value : limitsObj.personal[e.section_id] = e.value)

        //подсчет запланированных общих расходов
        expenses_plan
            .filter(e => e.personal === 0)
            .forEach(e => limitsObj.common[e.section_id] ? limitsObj.common[e.section_id] += e.value : limitsObj.common[e.section_id] = e.value)

        const limitsModel = controller.getStoreModel(constants.store.LIMIT)
        const allTravelLimits = toArray(await limitsModel.getFromIndex(constants.indexes.PRIMARY_ENTITY_ID, primary_entity_id))
        window.limit = limitsModel
        const personalLimits = allTravelLimits.filter(l => l.user_id === user_id && l.personal === 1).map(l => l.section_id)
        const commonLimits = allTravelLimits.filter(l => l.personal === 0).map(l => l.section_id)

        const personalExistingSections = Object.keys(limitsObj.personal)
        const commonExistingSections = Object.keys(limitsObj.common)
        for (const s of personalExistingSections) {
            if (!personalLimits.includes(s)) {
                await limitsModel.edit({
                    id: createId(user_id),
                    section_id: s,
                    value: 0,
                    primary_entity_id,
                    primary_entity_type: 'travel',
                    personal: 1,
                    user_id
                })
            }
        }

        for (const s of commonExistingSections) {
            if (!commonLimits.includes(s)) {
                await limitsModel.edit({
                    id: createId(user_id),
                    section_id: s,
                    value: 0,
                    primary_entity_id,
                    primary_entity_type: 'travel',
                    personal: 0,
                    user_id
                })
            }
        }


        let limitsExpenses = await controller.read({
            storeName: constants.store.LIMIT,
            index: constants.indexes.PRIMARY_ENTITY_ID,
            query: primary_entity_id
        })
        // const limits = []
        for (let limit of toArray(limitsExpenses)) {
            const section_id = limit.section_id

            const isPersonal = limit.user_id === user_id && limit.personal === 1

            const maxLimitPlan = isPersonal ? limitsObj.personal[section_id] : limitsObj.common[section_id]

            // const section = await controller.read({
            //     storeName: constants.store.SECTION,
            //     id: section_id
            // })

            if (limitsObj[isPersonal? 'personal': 'common'][section_id] && limit.value < maxLimitPlan) {
                console.log(await controller.write({
                    storeName: constants.store.LIMIT,
                    action: 'edit',
                    user_id,
                    data: {...limit, value: maxLimitPlan}
                }))

                // limit.value = maxLimitPlan
            }

            // !isPersonal && limits.push(
            //     {
            //         section_id,
            //         title: section.title,
            //         value: limit.value
            //     }
            // )
        }

        // total.limits = limits

        // total.updated_at = Date.now()
        // localStorage.setItem(constants.TOTAL_EXPENSES, JSON.stringify(total))
    }
}