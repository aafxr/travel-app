/**
 * выбрасывает исключение если value экземляр Error
 * @param {*} value
 * @throws {Error}
 */
export default function(value){
    if (value instanceof Error){
        throw value
    }
}