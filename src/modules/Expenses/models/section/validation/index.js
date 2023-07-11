// hidden
// title
// color



import isString from "../../../../../utils/validation/isString";
import validateDBQuery from "../../../../../utils/validation/validateDBQuery";
import isHexColor from "../../../../../utils/isHexColor";


function validatePayload(data) {
    return (
         isHexColor(data.color)
        && typeof data.hidden === 'number' && (data.hidden === 0 || data.hidden === 1)
        && isString(data.title)
        && isString(data.id)
    )
}


/**
 * @description объект валидации section
 * @type {import('../../../../../models/Model').validateObj}
 */
export default {
    add: validatePayload,
    edit: validatePayload,
    get: validateDBQuery,
    getFromIndex: validateDBQuery,
    remove: isString
}