import {Action} from "../../classes/StoreEntities";
import aFetch from "../../axios";

/**
 * отправляет action в очередь rabitmq
 * @param travelActions
 */
export async function sendTravelActionsToRMQ(...travelActions: Action<any>[]){
    return await aFetch.post('/rmq/put/travel/', travelActions)
}