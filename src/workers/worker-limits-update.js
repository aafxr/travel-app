/**
 * @param {MessageEvent<WorkerMessageType>} e
 */
import BaseService from "../classes/BaseService";
import constants from "../static/constants";
import storeDB from "../db/storeDB/storeDB";
import createId from "../utils/createId";
import defaultLimit from "../utils/default-values/defaultLimit";
import defaultUpdateTravelInfo from "../utils/defaultUpdateTravelInfo";
import getExchange from "./getExchange";

/**
 * @param {MessageEvent<WorkerMessageType<{primary_entity_id: string, user_id: string}>>} e
 */
self.onmessage = async (e) => {
    console.log('worker-limits-update.js')
    try {

        const {data} = e
        const {type, payload} = data
        const {primary_entity_id, user_id} = payload


        if (!user_id) {
            const error = new Error('Payload should contain field "user_id"')
            self.postMessage({type: 'error', payload: error})
            return
        }
        if (!primary_entity_id) {
            const error = new Error('Payload should contain field "primary_entity_id"')
            self.postMessage({type: 'error', payload: error})
            return
        }

        if (type === 'update-limit' && payload) {
            const tx = await storeDB
                .transaction([constants.store.CURRENCY, constants.store.EXPENSES_PLAN])

            /**@type{Map<string, Pick<ExpenseType, 'section_id' | 'value'|'currency'>>}*/
            const personalExpensesMap = new Map()

            /**@type{Map<string, Pick<ExpenseType, 'section_id' | 'value'|'currency'>>}*/
            const commonExpensesMap = new Map()

            const index = tx.objectStore(constants.store.EXPENSES_PLAN).index(constants.indexes.PRIMARY_ENTITY_ID)
            /**@type{IDBRequest<IDBCursorWithValue>}*/
            const requesCursor = index.openCursor(primary_entity_id)
            requesCursor.onerror = (err) => {
                /**@type{WorkerMessageType}*/
                const msg = {type: 'error', payload: err}
                self.postMessage(msg)
            }

            requesCursor.onsuccess = async () => {
                const cursor = requesCursor.result
                if (cursor) {
                    /**@type{ExpenseType}*/
                    const expense = cursor.value
                    const {value, currency, section_id, personal, user_id} = expense
                    /**@type{ExchangeType | null}*/
                    const exchange = await getExchange(tx, expense.datetime)
                    const coef = exchange?.value.find(e => e.symbol === currency)?.value || 1
                    if (personal === 0) {
                        if (commonExpensesMap.has(section_id)) {
                            commonExpensesMap.get(section_id).value += value * coef
                        } else {
                            commonExpensesMap.set(section_id, {section_id, value: value * coef, currency})
                        }
                    } else if (user_id === expense.user_id) {
                        if (personalExpensesMap.has(section_id)) {
                            personalExpensesMap.get(section_id).value += value * coef
                        } else {
                            personalExpensesMap.set(section_id, {section_id, value: value * coef, currency})
                        }
                    }
                    cursor.continue()
                } else {
                    const limitService = new BaseService(constants.store.LIMIT)

                    console.log('before ', personalExpensesMap, commonExpensesMap)

                    /**@type{LimitType[]}*/
                    const limits = await storeDB.getAllFromIndex(constants.store.LIMIT, constants.indexes.PRIMARY_ENTITY_ID, primary_entity_id)

                    const promises = limits.map(l => {
                        if (l.personal === 0) {
                            if (l.value < commonExpensesMap.get(l.section_id)?.value) {
                                l.value = commonExpensesMap.get(l.section_id).value
                                commonExpensesMap.delete(l.section_id)
                                return limitService.update(l, user_id)
                            }
                            commonExpensesMap.delete(l.section_id)
                        } else if (
                            l.id.split(':').shift() === user_id

                        ) {
                            if (l.value < personalExpensesMap.get(l.section_id)?.value) {
                                l.value = personalExpensesMap.get(l.section_id).value
                                personalExpensesMap.delete(l.section_id)
                                return limitService.update(l, user_id)
                            }
                            personalExpensesMap.delete(l.section_id)
                        }
                        return null
                    })

                    await Promise.all(promises)

                    const cp = Array.from(commonExpensesMap.values())
                        .map((l) => {
                            /**@type{LimitType}*/
                            const limit = defaultLimit(primary_entity_id, l.section_id, l.value, user_id, 0)
                            return limitService.create(limit, user_id)
                        })

                    await Promise.all(cp)
                        .then(res => console.log('await Promise.all(cp) ', res))

                    const pp = Array.from(personalExpensesMap.values())
                        .map((l) => {
                            /**@type{LimitType}*/
                            const limit = defaultLimit(primary_entity_id, l.section_id, l.value, user_id, 1)
                            return limitService.create(limit, user_id)
                        })
                    await Promise.all(pp)
                        .then(res => console.log('await Promise.all(pp) ', res))

                    /**@type{WorkerMessageType}*/
                    const message = {type: "done"}
                    self.postMessage(message)
                }
            }
        }
    } catch (err) {
        /**@type{WorkerMessageType}*/
        const message = {type: "error", payload: err}
        self.postMessage(message)
    }
}

