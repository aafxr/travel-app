/**
 * @typedef {object} ExpenseType
 * @property {string} [id]
 * @property {string} user_id
 * @property {string} primary_entity_type
 * @property {string} primary_entity_id
 * @property {string} entity_type
 * @property {string} entity_id
 * @property {string} title
 * @property {number} value >=0
 * @property {boolean | number} personal
 * @property {string} section_id
 * @property {string} datetime
 * @property {string} [created_at]
 */

import isString from "../../../utils/validation/isString";
import constants from "../db/constants";
import throwIfError from "../../../utils/throwIfError";
import createId from "../../../utils/createId";

/**
 * @param {ExpenseType} data
 * @returns {boolean}
 */
function validateExpensesData(data) {
    return (
        isString(data.user_id)
        && isString(data.primary_entity_type)
        && isString(data.primary_entity_id)
        && isString(data.entity_type)
        && isString(data.entity_id)
        && isString(data.title)
        && isPositiveNumber(data.value)
        && isString(data.section_id)
        && isString(data.section_id)
        && !Number.isNaN(Date.parse(data.datetime))
    );
}

/**
 * Возвращает объект с методами для работы с расходами (Expenses) в бд
 * @param {import('../../../db').LocalDB} db
 * @param {'actual' | 'planed'} type
 */
export default function (db, type) {
    const expensesType = type === 'actual' ? constants.store.EXPENSES_ACTUAL : constants.store.EXPENSES_PLANED;

    return {
        /**
         * @param {ExpenseType} data
         * @returns {Promise<void>}
         */
        async add(data) {
            if (!validateExpensesData(data)) {
                throw new Error(`[Expenses.add] Data is not valid: ${JSON.stringify(data)}`);
            }

            const id = createId(data.user_id);
            data.id = id;
            data.created_at = id;

            const res = await db.addElement(expensesType, data);
            throwIfError(res);

            return res;
        },

        /**
         * @param {string | number | IDBKeyRange} query
         * @returns {Promise<void>}
         */
        async get(query) {
            return await db.getElement(expensesType, query)
        },

        /**
         * @param {ExpenseType} data
         * @returns {Promise<void>}
         */
        async edit(data) {
            if (data.id && validateExpensesData(data)){
                return await db.editElement(expensesType, data)
            }
            throw new Error(`[Expenses.edit] Data is not valid: ${JSON.stringify(data)}`);

        },

        /**
         * @param {string} id
         * @returns {Promise<void>}
         */
        async remove(id) {
            return await  db.removeElement(expensesType, id)
        }
    };
}