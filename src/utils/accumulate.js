/**
 * @callback cb
 * @param {*} item
 * @returns {number}
 */

/**
 * утилита работает как reduce, но может принимать undefined, null, один объект
 * @function
 * @name accumulate
 * @param data
 * @param {cb} CB
 * @returns {number}
 * @category Utils
 */
export default function accumulate(data, CB) {
    if (data) {
        if (Array.isArray(data)) {
            return data.reduce((acc, item) => item ? CB(item) + acc : acc, 0)
        } else {
            return CB(data)
        }
    } else {
        return 0
    }
}