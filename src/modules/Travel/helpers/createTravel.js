import createId from "../../../utils/createId";
import {defaultTravel} from "../../../redux/travelStore/travelSlice";

/**
 * метод создания нового путешествия с набором дефолтных полей
 * @param {string} title
 * @param {string} user_id
 * @param {Object} [extraFields]
 * @returns {{code: string, updated_at: string, owner_id, created_at: string, id: (string|*), title}}
 */
export default function createTravel(title, user_id, extraFields = {}){
    const newTravel = {
        id: createId(user_id),
        code: '',
        title,
        owner_id: user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
    Object.keys(defaultTravel).forEach(key => {
        if(!newTravel[key]) {
            newTravel[key] = defaultTravel[key]()
        }
    })
    Object.keys(extraFields).forEach(key => newTravel[key] = extraFields[key])
    return newTravel
}