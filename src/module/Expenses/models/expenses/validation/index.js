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

const primaryEntityType = [
    'travel',
]

const entityType = [
    'excursion',
]


function validatePayload(data) {
    return (
        data.user_id && isString(data.user_id)
        && data.primary_entity_type && primaryEntityType.includes(data.primary_entity_type)
        && data.primary_entity_id && isString(data.primary_entity_id)
        && data.entity_type && entityType.includes(data.entity_type)
        && data.entity_id && isString(data.entity_id)
        && data.title && isString(data.title)
        && data.value && isPositiveNumber(data.value)
        && data.personal && typeof data.personal === 'number' && (data.personal === 0 || data.personal === 1)
        && data.section_id && isString(data.section_id)
        && data.datetime && !Number.isNaN(Date.parse(data.datetime))
        && data.created_at && !Number.isNaN(Date.parse(data.created_at))

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