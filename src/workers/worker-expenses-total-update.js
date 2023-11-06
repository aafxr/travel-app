// /**@type{DedicatedWorkerGlobalScope}*/
// self.postMessage('done')

import BaseService from "../classes/BaseService";
import constants from "../static/constants";
import storeDB from "../db/storeDB/storeDB";
import defaultUpdateTravelInfo from "../utils/defaultUpdateTravelInfo";
import dateToCurrencyKey from "../utils/dateToCurrencyKey";


/**
 * @param {MessageEvent<WorkerMessageType<{item: ExpenseType, user_id: string}>>} e
 */
self.onmessage = async (e) => {
    console.log('worker-expenses-total-update.js')
    try {
        const {data} = e
        const {type, payload} = data
        const {item, user_id} = payload

        if (!user_id) {
            const error = new Error('Payload should contain field "user_id"')
            self.postMessage({type: 'error', payload: error})
            return
        }
        if (!item) {
            const error = new Error('Payload should contain field "item"')
            self.postMessage({type: 'error', payload: error})
            return
        }

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
            /**@type{Pick<ExpenseType, 'section_id'|'personal'|'created_at'|'currency'|'value'|'user_id'>[]}*/
            const expensesList = []

            while (cursor) {
                /**@type{ExpenseType}*/
                const expense = cursor.value
                if (expense.primary_entity_id === item.primary_entity_id) {
                    const {currency, created_at, personal, section_id, value, user_id} = expense
                    const exchangeKey = dateToCurrencyKey(created_at)
                    expensesList.push({currency, created_at: exchangeKey, personal, section_id, value, user_id})
                }
                cursor = await cursor.continue();
            }

            const promises = expensesList.map(async (expense) => {
                const query  = IDBKeyRange.upperBound(new Date(expense.created_at).getTime())
                /**@type{ExchangeType}*/
                const exchange = await storeDB.getOne(constants.store.CURRENCY, query)
                const exchangeForDate = exchange.value.find(ex => ex.symbol === expense.currency)
                const exchangeVal = exchangeForDate ? exchangeForDate.value : 1

                if (map.has(expense.section_id)) {
                    if (expense.personal === 1 && expense.user_id === user_id){
                        map.get(expense.section_id).personal.total += (expense.value || 0)
                    } else if(expense.personal === 0){
                        map.get(expense.section_id).common.total += (expense.value || 0)
                    }
                } else {
                    /**@type{{common: TotalBySectionType, personal: TotalBySectionType}}*/
                    const newVal = defaultTotalBySectionValue(expense.section_id)

                    if (expense.personal === 1 && expense.user_id === user_id){
                        newVal.personal.total += (expense.value || 0) * exchangeVal
                        map.set(expense.section_id, newVal)
                    } else if(expense.personal === 0){
                        newVal.common.total += (expense.value || 0) * exchangeVal
                        map.set(expense.section_id, newVal)
                    }
                }
            })

            await Promise.all(promises)

            isPlan
                ? updateTravelInfo.planned_list = Array.from(map.values())
                : updateTravelInfo.actual_list = Array.from(map.values())
            updateTravelInfo.updated_at = Date.now()

            await storeDB.editElement(constants.store.UPDATED_TRAVEL_INFO, updateTravelInfo)
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

