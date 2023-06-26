import isString from "./validation/isString";

/**
 * возвращает новый id вида "prefix:id" если указан prefix либо id
 * @param {string | number} prefix
 * @returns {string}
 */
export default function(prefix){
    if(prefix && isString(prefix)){
        return prefix + ':' + Date.now()
    } else {
        return Date.now().toString()
    }
}