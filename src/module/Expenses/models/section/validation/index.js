// hidden
// title
// color



import isString from "../../../../../utils/validation/isString";
import validateDBQuery from "../../../../../utils/validation/validateDBQuery";
import isHexColor from "../../../../../utils/isHexColor";


function validatePayload(data) {
    return (
        data.color && isHexColor(data.color)
        && typeof data.hidden === 'number' && (data.hidden === 0 || data.hidden === 1)
        && data.title && isString(data.title)
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