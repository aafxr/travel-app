/**
 * @param {MessageEvent<WorkerMessageType>} e
 */
import BaseService from "../classes/BaseService";
import constants from "../static/constants";
import storeDB from "../db/storeDB/storeDB";
import defaultLimit from "../utils/default-values/defaultLimit";

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
            const limitService = new BaseService(constants.store.LIMIT)

            /**@type{UpdateTravelInfoType}*/
            const updatedTravelInfo = await storeDB.getOne(constants.store.UPDATED_TRAVEL_INFO, primary_entity_id)

            if (updatedTravelInfo) {
                /**@type{Map<string, number>}*/
                const totalPersonalMap = new Map()

                /**@type{Map<string, number>}*/
                const totalCommonMap = new Map()

                updatedTravelInfo.planned_list
                    .forEach(u => {
                        u.personal.total > 0 && totalPersonalMap.set(u.personal.section_id, u.personal.total)
                        u.common.total > 0 && totalCommonMap.set(u.common.section_id, u.common.total)
                    })

                let cursor = await limitService.getCursor()

                while (cursor) {
                    /**@type{LimitType}*/
                    const limit = cursor.value
                    const luID = limit.id.split(':')[0]
                    if (limit.primary_entity_id === primary_entity_id) {
                        if (limit.personal === 1 && luID === user_id && totalPersonalMap.has(limit.section_id)) {
                            const total = totalPersonalMap.get(limit.section_id)
                            if (limit.value < total) {
                                limit.value = total
                            }
                            totalPersonalMap.delete(limit.section_id)
                        } else if (limit.personal === 0 && totalCommonMap.has(limit.section_id)) {
                            const total = totalCommonMap.get(limit.section_id)
                            if (limit.value < total) {
                                limit.value = total
                            }
                            totalCommonMap.delete(limit.section_id)
                        }
                        cursor = await cursor.continue()
                    }
                }

                console.log({
                    totalCommonMap,
                    totalPersonalMap
                })
                const cList = Array.from(totalCommonMap).map(([section_id, value]) => defaultLimit(primary_entity_id, section_id, value))
                const pList = Array.from(totalPersonalMap).map(([section_id, value]) => defaultLimit(primary_entity_id, section_id, value))


                await Promise.all(
                    cList.map(l => limitService.create(l, user_id))
                )

                await Promise.all(
                    pList.map(l => limitService.create(l, user_id))
                )
            }
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