import validateDBQuery from "../../../../../utils/validation/validateDBQuery";
import isPositiveNumber from "../../../../../utils/validation/isPositiveNumber";
import isString from "../../../../../utils/validation/isString";


// user_id
// primary_entity_type
// primary_entity_id
// entity_type
// entity_id
// title
// value
// personal
// section_id
// datetime
// created_at

const primary_entity_type = [
    'travel',
]

const entityType = [
    'excursion',
]


function validatePayload(data) {
    return true
    return (
        isString(data.user_id)
        && isString(data.primary_entity_type)
        && isString(data.primary_entity_id)
        // && (data.entity_type ? isString(data.entity_type) : true)
        // && (data.entity_id ? isString(data.entity_id) : true)
        && isString(data.title)
        // && isPositiveNumber(data.value)
        // && isString(data.currency)
        // && typeof data.personal === 'number' && (data.personal === 0 || data.personal === 1)
        && isString(data.section_id)
        && !Number.isNaN(Date.parse(data.datetime))
        && !Number.isNaN(Date.parse(data.created_at))

    )
}


/**
 * @description объект валидации expenses
 * @type {import('../../../../../models/Model').validateObj}
 */
export default {
    add: validatePayload,
    edit: validatePayload,
    get: validateDBQuery,
    getFromIndex: validateDBQuery,
    remove: isString
}