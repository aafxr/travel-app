import {Action} from "../../classes/StoreEntities";

/**
 * отправляет action в очередь rabitmq
 * @param actions
 */
export async function sendActionsToRMQ(...actions: Action<any>[]){

}