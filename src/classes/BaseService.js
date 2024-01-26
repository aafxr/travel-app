import createAction from "../utils/createAction";
import ErrorReport from "../controllers/ErrorReport";
import storeDB from "./db/storeDB/storeDB";
import constants from "../static/constants";

/**
 * Сервис предоставляет набор методов (CRUD операции) для работы с БД
 * @class
 * @name BaseService<T>
 *
 *
 * @param {string} storeName имя store (таблицы) в бд, с которой будет работать данный сервис
 * @param {BaseServiceOptionsType} [options]
 * @constructor
 * @template T
 */
 class BaseService{
    /**@type{string}*/
    _storeName
    /**@type{BaseServiceOptionsType}*/
    options

    _onUpdate = () => {}
    _onCreate = () => {}
    _onDelete = () => {}
    _onRead = () => {}

    /**
     * @param {string} storeName имя store (таблицы) в бд, с которой будет работать данный сервис
     * @param {BaseServiceOptionsType} [options]
     * @constructor
     */
    constructor(storeName, options){
        if (!storeName) throw new Error('Property "storeName" not define')

        this._storeName = storeName
        this.options = options || {}
        if(options && typeof options === 'object'){
            Object
                .keys(options)
                .filter(key => key.startsWith('on') && ('_' + key) in this)
                .forEach(key => this['_' + key] = options[key])
        }

        this.create = this.create.bind(this)
        this.read = this.read.bind(this)
        this.update = this.update.bind(this)
        this.delete = this.delete.bind(this)
    }

    /**
     * геттер возвращает имя хранилища с которым данный сервис работает
     * @get
     * @name BaseService.storeName
     * @returns {string}
     */
    get storeName(){
        return this._storeName
    }
    

    /**
     * Метод записывает данные в бд
     * @method
     * @name BaseService.create
     * @param {T} item новый элемент
     * @param {string} user_id id пользователя, создавшего новый элемент
     * @returns {Promise<any | null>}
     */
    async create(item, user_id){
        try {
            const action = createAction(this._storeName, user_id, 'add', item)

            await storeDB.addElement(this._storeName, item)
            await storeDB.addElement(constants.store.EXPENSES_ACTIONS, action)

            this._onCreate(item)
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
     * @returns {Promise<T | null>}
     */
    async read(id){
        try {
            const result = await storeDB.getOne(this._storeName, id)
            this._onRead(id)
            return result
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
     * @param {T} item id элемента
     * @param {string} user_id id пользователя, обновившего элемент
     * @returns {Promise<any | null>}
     */
    async update(item, user_id){
        try {
            const action = createAction(this._storeName, user_id, 'update', item)
            await storeDB.editElement(this._storeName, item)
            await storeDB.addElement(constants.store.EXPENSES_ACTIONS, action)
            this._onUpdate(item)
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
     * @param {T} item удаляемый элемента
     * @param {string} user_id id пользователя, обновившего элемент
     * @returns {Promise<any | null>}
     */
    async delete(item, user_id){
        try {
            const action = createAction(this._storeName, user_id, 'remove', item)
            await storeDB.removeElement(this._storeName, item.id)
            await storeDB.addElement(constants.store.EXPENSES_ACTIONS, action)
            this._onDelete(item)
            return item
        } catch (err){
            console.error(err)
            ErrorReport.sendError(new Error("[BaseService/create] " +  err.message)).catch(console.error)
            return null
        }
    }

    /**
     * @method
     * @name BaseService.getCursor
     * @returns {Promise<IDBPCursorWithValue<DBTypes, *[], *[][0], *, "readonly">>}
     */
    async getCursor(){
        return storeDB.cursor(this.storeName)
    }

}

