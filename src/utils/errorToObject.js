/**
 * возвращает ошибку в виде объекта
 * @param {Error} e
 * @return {{message}}
 * @function
 * @name errorToObject
 * @category Utils
 */
export default function errorToObject(e){
    return {
        message: e.message,
        stack: e.stack
    }
}