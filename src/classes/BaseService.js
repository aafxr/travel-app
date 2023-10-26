import createAction from "../utils/createAction";
import ErrorReport from "../controllers/ErrorReport";
import storeDB from "../db/storeDB/storeDB";
import constants from "../static/constants";

/**
 * Сервис предоставляет набор методов (CRUD операции) для работы с БД
 * @class
 * @name BaseService
 *
 *
 * @param {string} storeName имя store (таблицы) в бд, с которой будет работать данный сервис
 * @constructor
 */
export default class BaseService{
    /**@type{string}*/
    storeName
    /**
     * @param {string} storeName имя store (таблицы) в бд, с которой будет работать данный сервис
     * @constructor
     */
    constructor(storeName){
        if (!storeName)
            throw new Error('Property "storeName" not define')

        this.storeName = storeName
    }

    /**
     * Метод записывает данные в бд
     * @method
     * @name BaseService.create
     * @param item новый элемент
     * @param {string} user_id id пользователя, создавшего новый элемент
     * @returns {Promise<any | null>}
     */
    async create(item, user_id){
        try {
            const action = createAction(this.storeName, user_id, 'add', item)

            await storeDB.addElement(this.storeName, item)
            await storeDB.addElement(constants.store.EXPENSES_ACTIONS, action)
            return item
        } catch (err){
            console.error(err)
            ErrorReport.sendError(new Error("[BaseService/create] " +  err.message)).catch(console.error)
            return null
        }
    }

    /**
     * Метод считывает из бд элемент с переданным id
     * @method
     * @name BaseService.read
     * @param {string} id id элемента
     * @returns {Promise<any | null>}
     */
    async read(id){
        try {
            return await storeDB.getOne(this.storeName, id)
        } catch (err){
            console.error(err)
            ErrorReport.sendError(new Error("[BaseService/create] " +  err.message)).catch(console.error)
            return null
        }
    }

    /**
     * Метод обновляет данные элемента в бд
     * @method
     * @name BaseService.update
     * @param item id элемента
     * @param {string} user_id id пользователя, обновившего элемент
     * @returns {Promise<any | null>}
     */
    async update(item, user_id){
        try {
            const action = createAction(this.storeName, user_id, 'update', item)
            await storeDB.editElement(this.storeName, item)
            await storeDB.addElement(constants.store.EXPENSES_ACTIONS, action)
            return item
        } catch (err){
            console.error(err)
            ErrorReport.sendError(new Error("[BaseService/create] " +  err.message)).catch(console.error)
            return null
        }
    }
    /**
     * Метод удаляет данные элемента из бд
     * @method
     * @name BaseService.delete
     * @param item удаляемый элемента
     * @param {string} user_id id пользователя, обновившего элемент
     * @returns {Promise<any | null>}
     */
    async delete(item, user_id){
        try {
            const action = createAction(this.storeName, user_id, 'remove', item)
            await storeDB.removeElement(this.storeName, item.id)
            await storeDB.addElement(constants.store.EXPENSES_ACTIONS, action)
            return item
        } catch (err){
            console.error(err)
            ErrorReport.sendError(new Error("[BaseService/create] " +  err.message)).catch(console.error)
            return null
        }
    }
}