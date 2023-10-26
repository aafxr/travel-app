import createId from "./createId";

/**
 * Утилита создает акшен
 * @function
 * @name createAction
 * @param {string} storeName имя сущности (travel, expenses_actual )
 * @param {string} user_id id пользователя, который внес изменения
 * @param {'add' | 'update' | 'get' | 'remove'} action тип action
 * @param {Object} data измененные данные
 * @param {Object} [extraFields] дополнительные поля
 * @returns {null | ActionType}
 * @category Utils
 */
export default function createAction(storeName, user_id, action, data, extraFields = {}) {
    if (storeName && user_id && action && data) {
        const newAction = {
            id: createId(user_id),
            action: action,
            data: data,
            entity: storeName,
            datetime: Date.now(),
            synced: 0,
            user_id: user_id
        }
        Object.keys(extraFields).forEach(key => newAction[key] = extraFields[key])
        return newAction
    } else {
        return null
    }
}