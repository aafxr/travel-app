import storeDB from "../db/storeDB/storeDB";
import constants from "../static/constants";
import {store} from "../redux/store";
import createAction from "../utils/createAction";
import ErrorReport from "../controllers/ErrorReport";
import ExpenseError from "../errors/ExpenseError";

/**
 *
 * @param {string} storeName
 * @returns {ExpenseType|*|null|[]|{read(string): Promise<ExpenseType|null>, readAllByPrimaryID(string): Promise<ExpenseType[]>, create(ExpenseType): Promise<ExpenseType|null>, update(ExpenseType): Promise<ExpenseType|null>, delete(ExpenseType): Promise<ExpenseType|null>}|*[]}
 */
const expenses_service = function (storeName){
    return {
        /**
         * Метод записывает данные в бд
         * @method
         * @name create
         * @param {ExpenseType} expense записываемые в бд данные
         * @returns {Promise<ExpenseType | null>}
         */
        async create(expense){
            try {
                const action = createAction(storeName, expense.user_id, "add", expense)
                await storeDB.addElement(storeName, expense)
                await storeDB.addElement(constants.store.EXPENSES_ACTIONS, action)
                return expense
            } catch (err){
                console.error(err)
                ErrorReport.sendError(new ExpenseError("create", err)).catch(console.error)
                return null
            }
        },
        /**
         * Метод считывает из бд запись о расходах
         * @method
         * @name read
         * @param {string} id id записи о расходах
         * @returns {Promise<ExpenseType | null>}
         */
        async read(id){
            try {
                const res = await storeDB.getOne(storeName, id)
                return res ? res : null
            } catch (err){
                console.error(err)
                ErrorReport.sendError(new ExpenseError("read", err)).catch(console.error)
                return null
            }
        },
        /**
         * Метод считывает из бд все записи с primary_entity_id о расходах
         * @method
         * @name readAllByPrimaryID
         * @param {string} primary_entity_id id путешествия
         * @returns {Promise<ExpenseType[]>}
         */
        async readAllByPrimaryID(primary_entity_id){
            try {
                return  await storeDB.getManyFromIndex(storeName, constants.indexes.PRIMARY_ENTITY_ID, primary_entity_id)
            } catch (err){
                console.error(err)
                ErrorReport.sendError(new ExpenseError("read", err)).catch(console.error)
                return []
            }
        },
        /**
         * Метод обновляет данные о расходе в бд
         * @method
         * @name update
         * @param {ExpenseType} expense обновляемые данные
         * @returns {Promise<ExpenseType|null>}
         */
        async update(expense){
            try {
                const action = createAction(storeName, expense.user_id, "update", expense)
                await storeDB.editElement(storeName, expense)
                await storeDB.addElement(constants.store.EXPENSES_ACTIONS, action)
                return expense
            } catch (err){
                console.error(err)
                ErrorReport.sendError(new ExpenseError("update", err)).catch(console.error)
                return null
            }
        },
        /**
         * Метод удаляет данные о расходе из бд
         * @method
         * @name delete
         * @param {ExpenseType} expense удаляемые данные о расходе
         * @returns {Promise<ExpenseType | null>}
         */
        async delete(expense){
            try {
                const action = createAction(storeName, expense.user_id, "remove", expense)
                await storeDB.removeElement(storeName, expense.id)
                await storeDB.addElement(constants.store.EXPENSES_ACTIONS, action)
                return expense
            } catch (err){
                console.error(err)
                ErrorReport.sendError(new ExpenseError("delete", err)).catch(console.error)
                return null
            }
        }
    }
}

export default expenses_service