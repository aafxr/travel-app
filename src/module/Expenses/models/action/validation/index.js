// uid
// datetime
// entity
// action
// data
// synced

import isString from "../../../../../utils/validation/isString";
import validateDBQuery from "../../../../../utils/validation/validateDBQuery";


const entityType = [
    'limit',
    'expenses_actual',
    'expenses_plan'
]

const actionType = [
    'add',
    'edit',
    'remove'
]

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
 * @type {import('../../../../../model/Model').validateObj}
 */
export default {
    add: validatePayload,
    edit: validatePayload,
    get: validateDBQuery,
    getFromIndex: validateDBQuery,
    remove: isString
}

