import isString from "../../../../../utils/validation/isString";
import validateDBQuery from "../../../../../utils/validation/validateDBQuery";


// id
// code
// title
// owner_id
// created_at
// updated_at



function validatePayload(data) {
    return (
        isString(data.id)
        // && isString(data.code)
        && isString(data.title)
        && isString(data.owner_id)
        && !Number.isNaN(Date.parse(data.created_at))
        && !Number.isNaN(Date.parse(data.updated_at))
    )
}


/**
 * @description объект валидации limit
 * @type {import('../../../../../models/Model').validateObj}
 */
const travelValidation = {
    add: validatePayload,
    update: validatePayload,
    get: validateDBQuery,
    getFromIndex: validateDBQuery,
    remove: isString
}

export default travelValidation