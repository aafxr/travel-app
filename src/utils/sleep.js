/**
 * @param {number} ms
 * @returns {Promise<unknown>}
 * @function
 * @name sleep
 * @category Utils
 */
export default function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}