import createId from "../../../utils/createId";
import toArray from "../../../utils/toArray";


/**
 * заполняет данные для нового action
 * @param {'add' | 'edit' | 'remove'} action
 * @param {string} user_id
 * @param {import('../../../models/Model').default} model
 * @param data
 * @returns {{action: {uid: (string|*), datetime: string, synced: number, data, action, entity}, type: string}}
 */
export default function createActionMessage(action, user_id, model, data) {
    return {
        type: 'action',
        action: {
            uid: createId(user_id),
            entity: model.storeName,
            synced: 0,
            action,
            data: toArray(data),
            datetime: new Date().toISOString()
        }
    }

}