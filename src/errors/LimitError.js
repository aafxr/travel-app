/**
 * Класс, описывающий ошибку в сервисе лимитов
 * @class
 * @extends Error
 * @name LimitError
 *
 *
 * @constructor
 * @param {"create" | "read" | "update" | "delete" | string} method имя метода в сервисе лимитов
 * @param {Error} err ошибка, возникшая в сервисе
 */
export default class LimitError extends Error{
    /**
     * @constructor
     * @param {"create" | "read" | "update" | "delete" | string} method имя метода в сервисе лимитов
     * @param {Error} err ошибка, возникшая в сервисе
     */
    constructor(method, err) {
        err.message = `[LimitError/${method}]` + err.message
        super(err);
    }
}