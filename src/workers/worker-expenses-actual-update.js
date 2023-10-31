// /**@type{DedicatedWorkerGlobalScope}*/
// self.postMessage('done')

import BaseService from "../classes/BaseService";
import constants from "../static/constants";
import storeDB from "../db/storeDB/storeDB";

const expenseService = new BaseService(constants.store.EXPENSES_ACTUAL, {})

/**
 * @param {MessageEvent<WorkerMessageType>} e
 */
self.onmessage = async (e) => {
    const {data} = e
    const {type, payload} = data
    /**@type{ExpenseType} */
    const item = payload
    /**@type{UpdateTravelInfoType}*/
    const UpdateTravelInfoType = await storeDB.getOne(constants.store.UPDATED_TRAVEL_INFO, item.primary_entity_id)

    if(type === 'update-expenses-actual' && payload){


        let cursor = await service.getCursor()
        while (cursor) {
            console.log(cursor.key, cursor.value);
            cursor = await cursor.continue();
        }
    }
}


