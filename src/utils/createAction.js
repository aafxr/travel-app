import createId from "./createId";

/**
 * @typedef {'add' | 'edit' | 'get' | 'remove'} ActionVariant
 */

/**
 * @typedef {object} ActionType
 * @property {string} uid
 * @property {string} datetime
 * @property {string} entity
 * @property {ActionVariant} action
 * @property {string} data
 * @property {boolean | number} synced
 */

/**
 * @typedef {object} PayloadType
 * @property {string} storeName
 * @property {string} user_id
 * @property {ActionVariant} action
 * @property {*} data
 */

/**
 * возвращает action для новой записи в бд
 * @param {PayloadType} payload должен содержать: storeName, user_id, action, data
 * @returns {ActionType}
 */
export default function createAction(payload) {
    const {storeName, user_id, action, data} = payload
    if (storeName && user_id && action && data) {
        return {
            id: createId(user_id),
            action: action,
            data: data,
            entity: storeName,
            datetime: new Date().toISOString(),
            synced: 0,
            uid: createId(user_id)
        }
    } else {
        return {}
    }
}