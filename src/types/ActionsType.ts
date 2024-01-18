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

export interface ActionsType<T extends {dto: Function}>{
    id: string
    action: string
    data: T
    entity: StoreName
    datetime: Date
    synced: DBFlagType
    user_id: string
}

