/**
 * выбрасывает исключение если value экземляр OtherPages
 * @param {*} value
 * @throws {Error}
 * @function
 * @category Utils
 */
export default function(value){
    if (value instanceof Error){
        throw value
    }
}