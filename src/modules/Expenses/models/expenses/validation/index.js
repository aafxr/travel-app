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


function validatePayload(data) {
    let valid = true

    if(!isString(data.user_id)){
        valid = false
        console.warn('user_id')
    }
    if(!isString(data.primary_entity_type)){
        valid = false
        console.warn('primary_entity_type')
    }
    if(!isString(data.primary_entity_id)){
        valid = false
        console.warn('primary_entity_id')
    }
    if(!(data.entity_type ? isString(data.entity_type) : true)){
        valid = false
        console.warn('entity_type')
    }
    if(!(data.entity_id ? isString(data.entity_id) : true)){
        valid = false
        console.warn('entity_id')
    }
    if(!isPositiveNumber(data.value)){
        valid = false
        console.warn('value')
    }

    if(!isString(data.title)){
        valid = false
        console.warn('title ',data.title)
    }
    if(!(typeof data.personal === 'number' && (data.personal === 0 || data.personal === 1))){
        valid = false
        console.warn('personal ', data.personal)
    }
    if(!isString(data.section_id)){
        valid = false
        console.warn('section_id')
    }
    if(Number.isNaN(Date.parse(data.datetime))){
        valid = false
        console.warn('datetime')
    }
    if(Number.isNaN(Date.parse(data.created_at))){
        valid = false
        console.warn('created_at')
    }

return valid






    // return (
        // isString(data.user_id)
        // && isString(data.primary_entity_type)
        // && isString(data.primary_entity_id)
        // && (data.entity_type ? isString(data.entity_type) : true)
        // && (data.entity_id ? isString(data.entity_id) : true)
        // && isString(data.title)
        // && isPositiveNumber(data.value)
        // && isString(data.currency)
        // && typeof data.personal === 'number' && (data.personal === 0 || data.personal === 1)
        // && isString(data.section_id)
        // && !Number.isNaN(Date.parse(data.datetime))
        // && !Number.isNaN(Date.parse(data.created_at))

    // )
}


/**
 * @description объект валидации expenses
 * @type {import('../../../../../models/Model').validateObj}
 */
export default {
    add: validatePayload,
    update: validatePayload,
    get: validateDBQuery,
    getFromIndex: validateDBQuery,
    remove: isString
}