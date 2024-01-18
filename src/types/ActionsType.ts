/**
 * @name ActionType
 * @typedef {Object} ActionType
 * @property {string} id
 * @property {string} action
 * @property {Object} data
 * @property {string} entity
 * @property {Date} datetime
 * @property {DBFlagType} synced
 * @property {string} user_id
 * @category Types
 */
import {StoreName} from "./StoreName";
import {DBFlagType} from "./DBFlagType";

export enum ActionName {
    ADD = "add",
    UPDATE = "update",
    DELETE = "delete"
}

export interface ActionType<T> {
    id: string
    action: ActionName
    data: T
    entity: StoreName
    datetime: Date
    synced: DBFlagType
    user_id: string
}

