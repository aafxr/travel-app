// section_id
// personal
// value
// primary_entity_id

import isString from "../../../../../utils/validation/isString";
import validateDBQuery from "../../../../../utils/validation/validateDBQuery";
import isPositiveNumber from "../../../../../utils/validation/isPositiveNumber";


function validatePayload(data) {
    return (
        data.section_id && isString(data.section_id)
        && typeof data.personal === 'number' && (data.personal === 0 || data.personal === 1)
        && isPositiveNumber(data.value)
        && isString(data.primary_entity_id)
        && isString(data.user_id)
        && isString(data.primary_entity_type)
    )
}


/**
 * @description объект валидации limit
 * @type {import('../../../../../models/Model').validateObj}
 */
const limitValidation = {
    add: validatePayload,
    edit: validatePayload,
    get: validateDBQuery,
    getFromIndex: validateDBQuery,
    remove: isString
}

export default limitValidation
