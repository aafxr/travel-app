import createId from "./createId";

/**
 * @typedef {Object} ActionType
 * @property {string} id
 * @property {string} action
 * @property {Object} data
 * @property {string} entity
 * @property {Date} datetime
 * @property {number} synced
 * @property {string} user_id
 */


/**
 *
 * @param {string} storeName имя сущности (travel, expenses_actual )
 * @param {string} user_id
 * @param {'add' | 'update' | 'get' | 'remove'} action
 * @param {Object} data
 * @returns {null | ActionType}
 */
export default function createAction(storeName, user_id, action, data) {
    if (storeName && user_id && action && data) {
        return {
            id: createId(user_id),
            action: action,
            data: data,
            entity: storeName,
            datetime: Date.now(),
            synced: 0,
            user_id: user_id
        }
    } else {
        return null
    }
}