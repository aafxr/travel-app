import {StoreName} from "../../types/StoreName";
import {IndexName} from "../../types/IndexName";
import {Action} from "../StoreEntities";
import {DB} from "../db/DB";

/**
 * сервис для рабботы с actions
 */
export class ActionService{
    /**
     * методпозволяет полусить время последнего action хранимого в локальной бд
     */
    static async getLastActionTime(){
        const cursor = await DB.openIndexCursor<Action<any>>(StoreName.ACTION, IndexName.DATETIME, IDBKeyRange.upperBound(new Date()), "prev")
        const action = (await cursor.next()).value
        if(action) return action.datetime
    }
}