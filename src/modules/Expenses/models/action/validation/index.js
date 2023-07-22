// uid
// datetime
// entity
// action
// data
// synced

import isString from "../../../../../utils/validation/isString";
import validateDBQuery from "../../../../../utils/validation/validateDBQuery";



function validatePayload(data) {
    return (
        data.uid && isString(data.uid)
        && isString(data.entity)
        && isString(data.action)
        && !Number.isNaN(Date.parse(data.datetime))
        && typeof data.synced === 'number' && (data.synced === 0 || data.synced === 1)
    )
}


/**
 * @description объект валидации actions
 * @type {import('../../../../../models/Model').validateObj}
 */
export default {
    add: validatePayload,
    edit: validatePayload,
    get: validateDBQuery,
    getFromIndex: validateDBQuery,
    remove: isString
}

