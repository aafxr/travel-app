import constants from "../db/constants";
import isString from "../../../utils/validation/isString";
import createId from "../../../utils/createId";
import throwIfError from "../../../utils/throwIfError";

/**
 * @typedef {object} ExpensesActionType
 * @property {string} [id]
 * @property {string} uid
 * @property {string} datetime
 * @property {'limit' |'expenses_actual' |'expenses_plan'} entity
 * @property {'add' | 'edit' | 'remove'} action
 * @property {string} data
 * @property {boolean | number} synced
 */

/**
 * @param {ExpensesActionType} data
 * @returns {boolean}
 */
function validateAction(data) {
    const entityTypes = ['limit', 'expenses_actual', 'expenses_plan']
    const actionType = ['add', 'edit', 'remove']

    return (
        isString(data.uid)
        && entityTypes.includes(data.entity)
        && actionType.includes(data.action)
        && !Number.isNaN(Date.parse(data.datetime))
        && isString(data.data)
    )
}

/**
 * возвращает модель для работы с ExpensesActionType
 * @param {import('../../../db').LocalDB} db
 * @returns {*|{add(*): Promise<*>, get(*): Promise<*>, remove(): Promise<*>}}
 */
export default function (db) {
    const storeName = constants.store.ACTIONS
    return {
        /**
         * @param {ExpensesActionType} data
         * @returns {Promise<string> | Promise<Error>}
         */
        async add(data) {
            if (!validateAction(data)){
                throw new Error(`[Action.add] Data is not valid: ${JSON.stringify(data)}`);
            }

            const id = createId(data.uid.split(':').shift())
            const result = await db.addElement(storeName, data)

            throwIfError(result)

            return id
        },

        /**
         * @param {string | boolean | IDBKeyRange} query
         * @returns {Promise<ExpensesActionType> | Promise<Error>}
         */
        async get(query) {
            return await db.getElement(storeName, query)
        },

        /**
         * @param {string} id
         * @returns {Promise<void>}
         */
        async remove(id) {
            return await db.removeElement(storeName, id)
        }
    }
}