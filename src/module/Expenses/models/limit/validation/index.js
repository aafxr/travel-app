// section_id
// personal
// value

import isString from "../../../../../utils/validation/isString";
import validateDBQuery from "../../../../../utils/validation/validateDBQuery";


function validatePayload(data) {
    return (
        data.section_id && isString(data.section_id)
        && data.personal && typeof data.personal === 'number' && (data.personal === 0 || data.personal === 1)
        && data.value && typeof data.value === 'number' && data.value >= 0
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