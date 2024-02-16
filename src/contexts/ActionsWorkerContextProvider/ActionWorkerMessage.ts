import {User} from "../../classes/StoreEntities";

export type ActionWorkerMessageType = {
    type: 'user',
    payload: User
} | {
    type: 'unauthorized'
} | {
    type: 'synced'
} | {
    type: 'init',
    payload: { user: User }
}

export class ActionWorkerMessage {

    static unauthorized(): ActionWorkerMessageType {
        return {type: 'unauthorized'}
    }

    static user(user: User): ActionWorkerMessageType {
        return {type: 'user', payload: user}
    }

    static synced(): ActionWorkerMessageType {
        return {type: 'synced'}
    }

    static init(user: User): ActionWorkerMessageType{
        return {type: "init", payload: {user}}
    }
}