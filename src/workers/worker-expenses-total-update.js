// /**@type{DedicatedWorkerGlobalScope}*/
// self.postMessage('done')

import BaseService from "../classes/BaseService";
import constants from "../static/constants";
import storeDB from "../db/storeDB/storeDB";
import defaultUpdateTravelInfo from "../utils/defaultUpdateTravelInfo";


/**
 * @param {MessageEvent<WorkerMessageType>} e
 */
self.onmessage = async (e) => {
    try {

        const {data} = e
        const {type, payload} = data
        /**@type{ExpenseType} */
        const item = payload
        /**@type{UpdateTravelInfoType}*/
        let updateTravelInfo = await storeDB.getOne(constants.store.UPDATED_TRAVEL_INFO, item.primary_entity_id)
        if (!updateTravelInfo) updateTravelInfo = defaultUpdateTravelInfo(item.primary_entity_id)

        if ((type === 'update-expenses-actual' || type === 'update-expenses-planned') && payload) {
            const isPlan = type === 'update-expenses-planned'
            const storeName = isPlan
                ? constants.store.EXPENSES_PLAN
                : constants.store.EXPENSES_ACTUAL

            const service = new BaseService(storeName)

            /** @type {Map<string, {common: TotalBySectionType, personal: TotalBySectionType}>}*/
            const map = new Map()

            let cursor = await service.getCursor()
            /**@type{Pick<ExpenseType, 'section_id'|'personal'|'created_at'|'currency'|'value'>[]}*/
            const expensesList = []
            while (cursor) {
                /**@type{ExpenseType}*/
                const expense = cursor.value
                if (expense.primary_entity_id === item.primary_entity_id) {
                    const {currency, created_at, personal, section_id, value} = expense
                    const exchangeKey = new Date(created_at).toISOString().split('T').shift().split('-').reverse().join('.')
                    expensesList.push({currency, created_at: exchangeKey, personal, section_id, value})
                }

                cursor = await cursor.continue();
            }

            console.log(expensesList)
            expensesList.map(async (expense) => {
                /**@type{ExchangeType}*/
                const exchange = await storeDB.getOne(constants.store.CURRENCY, expense.created_at)
                const exchangeForDate = exchange.value.find(ex => ex.symbol === expense.currency)
                const exchangeVal = exchangeForDate ? exchangeForDate.value : 1

                if (map.has(expense.section_id)) {
                    expense.personal === 1
                        ? map.get(expense.section_id).personal.total += (expense.value || 0)
                        : map.get(expense.section_id).common.total += (expense.value || 0)
                } else {
                    /**@type{{common: TotalBySectionType, personal: TotalBySectionType}}*/
                    const newVal = defaultTotalBySectionValue(expense.section_id)

                    expense.personal === 1
                        ? newVal.personal.total += (expense.value || 0) * exchangeVal
                        : newVal.common.total += (expense.value || 0) * exchangeVal

                    map.set(expense.section_id, newVal)
                }
            })

            isPlan
                ? updateTravelInfo.planned_list = Array.from(map.values())
                : updateTravelInfo.actual_list = Array.from(map.values())
            updateTravelInfo.updated_at = Date.now()
            console.log(updateTravelInfo)
            storeDB.editElement(constants.store.UPDATED_TRAVEL_INFO, updateTravelInfo)
                .catch(console.error)
        }

        /**@type{WorkerMessageType}*/
        const message = {type: "done"}
        self.postMessage(message)
    } catch (err) {
        /**@type{WorkerMessageType}*/
        const message = {type: "error", payload: err}
        self.postMessage(message)
    }
}

/**
 * @fucnction
 * @name defaultTotalBySectionValue
 * @param {string} section_id
 * @returns {{common: TotalBySectionType, personal: TotalBySectionType}}
 * @category Utils
 */
function defaultTotalBySectionValue(section_id) {
    return {
        common: {
            total: 0,
            personal: 0,
            section_id: section_id
        },
        personal: {
            total: 0,
            personal: 1,
            section_id: section_id
        }
    }
}

