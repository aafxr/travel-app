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
        && data.entity && entityType.includes(data.entity)
        && data.action && entityType.includes(data.action)
        && data.datetime && !Number.isNaN(Date.parse(data.datetime))
        && data.synced && typeof data.synced === 'number' && (data.synced === 0 || data.synced === 1)
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

