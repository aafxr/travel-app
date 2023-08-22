import currencyToFixedFormat from "../../../utils/currencyToFixedFormat";
import expensesDB from "../../../db/expensesDB/expensesDB";
import createAction from "../../../utils/createAction";
import limitsModel from '../models/limit/limitModel'
import constants from "../../../static/constants";
import createId from "../../../utils/createId";
import toArray from "../../../utils/toArray";
import {store} from "../../../redux/store";


export function updateLimits(primary_entity_id, user_id = {}) {
    /**
     * @param {import('../../../controllers/ActionController').ActionType} [action]
     */
    return async function () {
        return new Promise(async (resolve, reject) => {
            try {
                const currency = store.getState().expenses.currency
                const expenses_plan = await expensesDB.getManyFromIndex(
                    constants.store.EXPENSES_PLAN,
                    constants.indexes.PRIMARY_ENTITY_ID,
                    primary_entity_id
                )

                const limitsObj = {
                    personal: {},
                    common: {}
                }

                //подсчет запланированных персональных расходов
                expenses_plan
                    .filter(e => e.personal === 1 && e.user_id === user_id)
                    .forEach(e => {
                        const coeffList = currency[new Date(e.datetime).toLocaleDateString()] || []
                        const coeff = e.currency
                            ? coeffList.find(c => c.symbol === e.currency)?.value || 1
                            : 1
                        limitsObj.personal[e.section_id] ? limitsObj.personal[e.section_id] += e.value * coeff : limitsObj.personal[e.section_id] = e.value * coeff
                    })

                //подсчет запланированных общих расходов
                expenses_plan
                    .filter(e => e.personal === 0)
                    .forEach(e => {
                        const coeffList = currency[new Date(e.datetime).toLocaleDateString()]
                            || currency[new Date().toLocaleDateString()]
                            || []
                        const coeff = e.currency
                            ? coeffList.find(c => c.symbol === e.currency)?.value || 1
                            : 1
                        limitsObj.common[e.section_id] ? limitsObj.common[e.section_id] += e.value * coeff : limitsObj.common[e.section_id] = e.value * coeff
                    })

                const allTravelLimits = toArray(await limitsModel.getFromIndex(constants.indexes.PRIMARY_ENTITY_ID, primary_entity_id))
                const newLimits = []

                const personalLimits = allTravelLimits.filter(l => l.user_id === user_id && l.personal === 1).map(l => l.section_id)
                const commonLimits = allTravelLimits.filter(l => l.personal === 0).map(l => l.section_id)

                const personalExistingSections = Object.keys(limitsObj.personal)
                const commonExistingSections = Object.keys(limitsObj.common)

                for (const s of personalExistingSections) {
                    if (!personalLimits.includes(s)) {
                        newLimits.push({
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
                        newLimits.push({
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

                for (let limit of allTravelLimits) {
                    const section_id = limit.section_id

                    const isPersonal = limit.user_id === user_id && limit.personal === 1

                    let maxLimitPlan = isPersonal ? limitsObj.personal[section_id] : limitsObj.common[section_id]
                    maxLimitPlan = currencyToFixedFormat((maxLimitPlan || 0).toString())

                    if (limitsObj[isPersonal ? 'personal' : 'common'][section_id] && limit.value < maxLimitPlan) {
                        limit.value = maxLimitPlan
                        const action = createAction(constants.store.LIMIT, user_id, 'update', limit)
                        await Promise.all([
                            expensesDB.editElement(constants.store.LIMIT, limit),
                            expensesDB.addElement(constants.store.EXPENSES_ACTIONS, action)
                        ])
                    }
                }

                for (let limit of newLimits) {
                    const section_id = limit.section_id

                    const isPersonal = limit.user_id === user_id && limit.personal === 1

                    let maxLimitPlan = isPersonal ? limitsObj.personal[section_id] : limitsObj.common[section_id]
                    maxLimitPlan = currencyToFixedFormat((maxLimitPlan || 0).toString())

                    if (limitsObj[isPersonal ? 'personal' : 'common'][section_id] && limit.value < maxLimitPlan) {
                        limit.value = maxLimitPlan
                        const action = createAction(constants.store.LIMIT, user_id, 'add', limit)
                        await Promise.all([
                            expensesDB.editElement(constants.store.LIMIT, limit),
                            expensesDB.addElement(constants.store.EXPENSES_ACTIONS, action)
                        ])
                    }
                }
                resolve(allTravelLimits.concat(newLimits))
            } catch (err) {
                reject(err)
            }
        })
    }
}