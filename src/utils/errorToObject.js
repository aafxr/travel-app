/**
 * возвращает ошибку в виде объекта
 * @param {Error} e
 * @return {{message}}
 */
export default function errorToObject(e){
    return {
        message: e.message,
        stack: e.stack
    }
}