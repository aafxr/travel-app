/**
 * @param {*} data
 * @returns {boolean}
 * @function
 * @name isError
 * @category Utils
 */
export default function isError(data){
    return data instanceof Error
}