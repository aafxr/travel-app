import isString from "./isString";


/**
 * проверка на валидность query для indexeddb, возвращает true если  query - string / number / IDBKeyRange
 * @param {*} query -
 * @returns {boolean}
 */
export default function validateDBQuery(query){
    return (
        isString(query)
        || typeof query === 'number'
        || query instanceof IDBKeyRange
    )
}