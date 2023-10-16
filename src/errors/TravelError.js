/**
 * Класс, описывающий ошибку в сервисе путешествие
 * @class
 * @extends Error
 * @name TravelError
 *
 *
 * @constructor
 * @param {"create" | "read" | "update" | "delete" | string} method имя метода в сервисе путешествие
 * @param {Error} err ошибка, возникшая в сервисе
 */
export default class TravelError extends Error{
    /**
     * @constructor
     * @param {"create" | "read" | "update" | "delete" | string} method имя метода в сервисе путешествие
     * @param {Error} err ошибка, возникшая в сервисе
     */
    constructor(method, err) {
        err.message = `[TravelError/${method}]` + err.message
        super(err);
    }
}