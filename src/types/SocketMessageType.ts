import {Action} from "../classes/StoreEntities";

export type SocketMessageType = {
    id:string,
    join: string,
    leave: string,
    action: Action<any>,
    message:{}
}