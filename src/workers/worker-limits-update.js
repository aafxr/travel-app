/**
 * @param {MessageEvent<WorkerMessageType>} e
 */
import BaseService from "../classes/BaseService";
import constants from "../static/constants";
import storeDB from "../db/storeDB/storeDB";
import createId from "../utils/createId";

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

            const index = tx.objectStore(constants.store.EXPENSES_PLAN).index(constants.indexes.PRIMARY_ENTITY_ID)
            /**@type{IDBRequest<IDBCursorWithValue>}*/
            const requesCursor = index.openCursor(primary_entity_id)
            requesCursor.onerror = (err) => {
                /**@type{WorkerMessageType}*/
                const msg = {type: 'error', payload: err}
                self.postMessage(msg)
            }

            /**@type{Map<string, Pick<ExpenseType, 'section_id' | 'value'|'currency'>>}*/
            const personalExpensesMap = new Map()

            /**@type{Map<string, Pick<ExpenseType, 'section_id' | 'value'|'currency'>>}*/
            const commonExpensesMap = new Map()

            console.log('---------------------------------------------------------------------')
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

                    /**@type{LimitType[]}*/
                    const limits = await storeDB.getAllFromIndex(constants.store.LIMIT, constants.indexes.PRIMARY_ENTITY_ID, primary_entity_id)

                    const promises = limits.map(l => {
                        if (l.personal === 0 && l.value < commonExpensesMap.get(l.section_id)?.value) {
                            l.value = commonExpensesMap.get(l.section_id).value
                            commonExpensesMap.delete(l.section_id)
                            return limitService.update(l, user_id)
                        } else if (
                            l.id.split(':').shift() === user_id
                            && l.value < personalExpensesMap.get(l.section_id)?.value
                        ) {
                            l.value = personalExpensesMap.get(l.section_id).value
                            personalExpensesMap.delete(l.section_id)
                            return limitService.update(l, user_id)
                        }
                    })

                    await Promise.all(promises)

                    const cp = Array.from(commonExpensesMap.values())
                        .map((l) => {
                            /**@type{LimitType}*/
                            const limit = {
                                id: createId(user_id),
                                section_id: l.section_id,
                                value: l.value,
                                personal: 0,
                                primary_entity_id
                            }
                            return limitService.create(limit, user_id)
                        })

                    const pp = Array.from(personalExpensesMap.values())
                        .map((l) => {
                            /**@type{LimitType}*/
                            const limit = {
                                id: createId(user_id),
                                section_id: l.section_id,
                                value: l.value,
                                personal: 0,
                                primary_entity_id
                            }
                            return limitService.create(limit, user_id)
                        })

                    await Promise.all(cp)
                    await Promise.all(pp)

                    /**@type{WorkerMessageType}*/
                    const message = {type: "done"}
                    self.postMessage(message)
                }
            }
            console.log('---------------------------------------------------------------------')
            //
            //     const limitService = new BaseService(constants.store.LIMIT)
            //
            //     /**@type{UpdateTravelInfoType}*/
            //     const updatedTravelInfo = await storeDB.getOne(constants.store.UPDATED_TRAVEL_INFO, primary_entity_id)
            //
            //     if (updatedTravelInfo) {
            //         /**@type{Map<string, number>}*/
            //         const totalPersonalMap = new Map()
            //
            //         /**@type{Map<string, number>}*/
            //         const totalCommonMap = new Map()
            //
            //         updatedTravelInfo.planned_list
            //             .forEach(u => {
            //                 u.personal.total > 0 && totalPersonalMap.set(u.personal.section_id, u.personal.total)
            //                 u.common.total > 0 && totalCommonMap.set(u.common.section_id, u.common.total)
            //             })
            //
            //         let cursor = await limitService.getCursor()
            //
            //         while (cursor) {
            //             /**@type{LimitType}*/
            //             const limit = cursor.value
            //             const luID = limit.id.split(':')[0]
            //             if (limit.primary_entity_id === primary_entity_id) {
            //                 if (limit.personal === 1 && luID === user_id && totalPersonalMap.has(limit.section_id)) {
            //                     const total = totalPersonalMap.get(limit.section_id)
            //                     if (limit.value < total) {
            //                         limit.value = total
            //                     }
            //                     totalPersonalMap.delete(limit.section_id)
            //                 } else if (limit.personal === 0 && totalCommonMap.has(limit.section_id)) {
            //                     const total = totalCommonMap.get(limit.section_id)
            //                     if (limit.value < total) {
            //                         limit.value = total
            //                     }
            //                     totalCommonMap.delete(limit.section_id)
            //                 }
            //                 cursor = await cursor.continue()
            //             }
            //         }
            //
            //         console.log({
            //             totalCommonMap,
            //             totalPersonalMap
            //         })
            //         const cList = Array.from(totalCommonMap).map(([section_id, value]) => defaultLimit(primary_entity_id, section_id, value))
            //         const pList = Array.from(totalPersonalMap).map(([section_id, value]) => defaultLimit(primary_entity_id, section_id, value))
            //
            //
            //         await Promise.all(
            //             cList.map(l => limitService.create(l, user_id))
            //         )
            //
            //         await Promise.all(
            //             pList.map(l => limitService.create(l, user_id))
            //         )
            //     }
        }

        // /**@type{WorkerMessageType}*/
        // const message = {type: "done"}
        // self.postMessage(message)
    } catch (err) {
        /**@type{WorkerMessageType}*/
        const message = {type: "error", payload: err}
        self.postMessage(message)
    }
}

/**
 * @param {IDBTransaction} transaction
 * @param {string | number} date
 * @returns {Promise<ExchangeType | null>}
 */
function getExchange(transaction, date) {
    return new Promise(res => {
        const key = new Date(date).getTime()
        const store = transaction.objectStore(constants.store.CURRENCY)

        const req = store.get(IDBKeyRange.upperBound(key))
        req.onerror = () => res(null)
        req.onsuccess = () => {
            const ex = req.result
            if (ex) {
                res(ex)
            } else {
                res(null)
            }
        }
    })
}