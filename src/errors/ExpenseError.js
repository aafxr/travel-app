/**
 * Класс, описывающий ошибку в сервисе расходов
 * @class
 * @extends Error
 * @name ExpenseError
 *
 *
 * @constructor
 * @param {"create" | "read" | "update" | "delete" | string} method имя метода в сервисе расходов
 * @param {Error} err ошибка, возникшая в сервисе
 */
export default class ExpenseError extends Error{
    /**
     * @constructor
     * @param {"create" | "read" | "update" | "delete" | string} method имя метода в сервисе расходов
     * @param {Error} err ошибка, возникшая в сервисе
     */
    constructor(method, err) {
        super(`[ExpenseError/${method}]` + err.message);
    }
}