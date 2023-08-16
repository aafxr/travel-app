import createId from "../../../utils/createId";

/**
 *
 * @param {string} title
 * @param {string} user_id
 * @returns {{code: string, updated_at: string, owner_id, created_at: string, id: (string|*), title}}
 */
export default function createTravel(title, user_id){
    return {
        id: createId(),
        code: '',
        title,
        owner_id: user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
}