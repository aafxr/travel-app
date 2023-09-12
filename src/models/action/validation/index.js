import isString from "../../../utils/validation/isString";
import validateDBQuery from "../../../utils/validation/validateDBQuery";


function validatePayload(data) {
    return (
        isString(data.id)
        && isString(data.user_id)
        && isString(data.entity)
        && isString(data.action)
        && typeof data.datetime === 'number'
        && typeof data.synced === 'number' && (data.synced === 0 || data.synced === 1)
    )
}


/**
 * @description объект валидации actions
 * @type {import('../../Model').validateObj}
 */
const actionValidationObject =  {
    add: validatePayload,
    update: validatePayload,
    get: validateDBQuery,
    getFromIndex: validateDBQuery,
    remove: isString
}

export default actionValidationObject

