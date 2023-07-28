import constants from "../../../static/constants";
import toArray from "../../../utils/toArray";
import createId from "../../../utils/createId";
import currencyToFixedFormat from "../../../utils/currencyToFixedFormat";

// const totalDefault = {
//     updated_at: Date.now(),
//     limits: [],
//     total_actual: 0,
//     total_planed: 0
// }


export function onUpdate(primary_entity_id, user_id, currency) {
    /**
     *
     * @param {ActionController} controller
     * @param {import('../../../controllers/ActionController').ActionType} [action]
     */
    return async function (controller) {
        const expenses_plan = await controller.read({
            storeName: constants.store.EXPENSES_PLAN,
            index: constants.indexes.PRIMARY_ENTITY_ID,
            query: primary_entity_id
        })

        const limitsObj = {
            personal: {},
            common: {}
        }

        const coeffList = currency.reduce((a, c) => {
            a[c.char_code] = c
            return a
        }, {})

        //подсчет запланированных персональных расходов
        expenses_plan
            .filter(e => e.personal === 1 && e.user_id === user_id)
            .forEach(e => {
                const coeff = coeffList[e.currency]?.value || 1
                limitsObj.personal[e.section_id] ? limitsObj.personal[e.section_id] += e.value * coeff : limitsObj.personal[e.section_id] = e.value * coeff
            })

        //подсчет запланированных общих расходов
        expenses_plan
            .filter(e => e.personal === 0)
            .forEach(e => {
                const coeff = coeffList[e.currency]?.value || 1
                limitsObj.common[e.section_id] ? limitsObj.common[e.section_id] += e.value * coeff : limitsObj.common[e.section_id] = e.value * coeff
            })

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

        for (let limit of toArray(limitsExpenses)) {
            const section_id = limit.section_id

            const isPersonal = limit.user_id === user_id && limit.personal === 1

            let maxLimitPlan = isPersonal ? limitsObj.personal[section_id] : limitsObj.common[section_id]
            maxLimitPlan = currencyToFixedFormat((maxLimitPlan || 0).toString())

            if (limitsObj[isPersonal ? 'personal' : 'common'][section_id] && limit.value < maxLimitPlan) {
                console.log(await controller.write({
                    storeName: constants.store.LIMIT,
                    action: 'edit',
                    user_id,
                    data: {...limit, value: maxLimitPlan }
                }))
            }
        }
    }
}