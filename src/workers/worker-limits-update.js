/**
 * @param {MessageEvent<WorkerMessageType>} e
 */
import BaseService from "../classes/BaseService";
import constants from "../static/constants";
import storeDB from "../db/storeDB/storeDB";


self.onmessage = async (e) => {
    try {

        const {data} = e
        const {type, payload} = data
        /**@type{{primary_entity_id: string, user_id: string}} */
        const t = payload
        const {primary_entity_id, user_id} = t

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
                    if (limit.primary_entity_id === primary_entity_id) {
                        if (limit.personal === 1 && totalPersonalMap.has(limit.section_id)) {
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