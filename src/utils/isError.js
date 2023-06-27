/**
 * @param {*} data
 * @returns {boolean}
 */
export default function isError(data){
    return data instanceof Error
}