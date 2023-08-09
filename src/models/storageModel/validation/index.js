import isString from "../../../utils/validation/isString";
import validateDBQuery from "../../../utils/validation/validateDBQuery";

function validatePayload(data){
    let valid = true

    if(!isString(data.name)){
        valid = false
        console.warn('name')
    }
    if(!data.value){
        valid = false
        console.warn('value')
    }

    return valid
}


const storeValidation = {
    add: validatePayload,
    update: validatePayload,
    get: validateDBQuery,
    getFromIndex: validateDBQuery,
    remove: isString
}

export default storeValidation