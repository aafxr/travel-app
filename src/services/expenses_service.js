import storeDB from "../db/storeDB/storeDB";
import constants from "../static/constants";
import createAction from "../utils/createAction";
import ErrorReport from "../controllers/ErrorReport";
import ExpenseError from "../errors/ExpenseError";
import {de} from "date-fns/locale";

/**
 * Сервис добавляет CRUD операци для работы с бд
 * @name ExpenseService
 * @class
 * @category Services
 *
 *
 * @param {string} storeName имя хранилища в бд, с которым будет работать сервис
 * @constructor
 */
export class ExpenseService {
    /**
     * @param {string} storeName имя хранилища в бд, с которым будет работать сервис
     * @constructor
     */
    constructor(storeName) {
        this.storeName = storeName
    }

    /**
     * Метод записывает данные в бд
     * @method
     * @name ExpenseService.create
     * @param {ExpenseType} expense записываемые в бд данные
     * @returns {Promise<ExpenseType | null>}
     */
    async create(expense) {
        try {
            debugger
            const action = createAction(this.storeName, expense.user_id, "add", expense)
            await storeDB.addElement(this.storeName, expense)
            await storeDB.addElement(constants.store.EXPENSES_ACTIONS, action)
            return expense
        } catch (err) {
            console.error(err)
            ErrorReport.sendError(new ExpenseError("create", err)).catch(console.error)
            return null
        }
    }

    /**
     * Метод считывает из бд запись о расходах
     * @method
     * @name ExpenseService.read
     * @param {string} id id записи о расходах
     * @returns {Promise<ExpenseType | null>}
     */
    async read(id) {
        try {
            const res = await storeDB.getOne(this.storeName, id)
            return res ? res : null
        } catch (err) {
            console.error(err)
            ErrorReport.sendError(new ExpenseError("read", err)).catch(console.error)
            return null
        }
    }

    /**
     * Метод считывает из бд все записи с primary_entity_id о расходах
     * @method
     * @name ExpenseService.readAllByPrimaryID
     * @param {string} primary_entity_id id путешествия
     * @returns {Promise<ExpenseType[]>}
     */
    async readAllByPrimaryID(primary_entity_id) {
        try {
            return await storeDB.getManyFromIndex(this.storeName, constants.indexes.PRIMARY_ENTITY_ID, primary_entity_id)
        } catch (err) {
            console.error(err)
            ErrorReport.sendError(new ExpenseError("read", err)).catch(console.error)
            return []
        }
    }

    /**
     * Метод обновляет данные о расходе в бд
     * @method
     * @name ExpenseService.update
     * @param {ExpenseType} expense обновляемые данные
     * @returns {Promise<ExpenseType|null>}
     */
    async update(expense) {
        try {
            debugger
            const action = createAction(this.storeName, expense.user_id, "update", expense)
            await storeDB.editElement(this.storeName, expense)
            await storeDB.addElement(constants.store.EXPENSES_ACTIONS, action)
            return expense
        } catch (err) {
            console.error(err)
            ErrorReport.sendError(new ExpenseError("update", err)).catch(console.error)
            return null
        }
    }

    /**
     * Метод удаляет данные о расходе из бд
     * @method
     * @name ExpenseService.delete
     * @param {ExpenseType} expense удаляемые данные о расходе
     * @returns {Promise<ExpenseType | null>}
     */
    async delete(expense) {
        try {
            const action = createAction(this.storeName, expense.user_id, "remove", expense)
            await storeDB.removeElement(this.storeName, expense.id)
            await storeDB.addElement(constants.store.EXPENSES_ACTIONS, action)
            return expense
        } catch (err) {
            console.error(err)
            ErrorReport.sendError(new ExpenseError("delete", err)).catch(console.error)
            return null
        }
    }
}

/**
 * Instance класса ExpenseService для работы с хранилищем  EXPENSES_ACTUAL
 * @type {ExpenseService}
 * @category Services
 */
export const expenses_actual_service = new ExpenseService(constants.store.EXPENSES_ACTUAL)
/**
 * Instance класса ExpenseService для работы с хранилищем  EXPENSES_PLAN
 * @type {ExpenseService}
 * @category Services
 */
export const expenses_plan_service = new ExpenseService(constants.store.EXPENSES_PLAN)
