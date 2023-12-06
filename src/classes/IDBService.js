import defaultHandleError from "../utils/error-handlers/defaultHandleError";
import storeDB from "../db/storeDB/storeDB";

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
export default class IDBService {
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
    constructor(storeName, options = {}) {
        if (!storeName) throw new Error('Property "storeName" not define')

        this._storeName = storeName
        this.options = options
        Object
            .keys(options)
            .filter(key => key.startsWith('on') && ('_' + key) in this)
            .forEach(key => this['_' + key] = options[key])

        this.create = this.create.bind(this)
        this.read = this.read.bind(this)
        this.update = this.update.bind(this)
        this.delete = this.create.bind(this)
    }

    /**
     * геттер возвращает имя хранилища с которым данный сервис работает
     * @get
     * @name BaseService.storeName
     * @returns {string}
     */
    get storeName() {
        return this._storeName
    }


    /**
     * Метод записывает данные в бд
     * @method
     * @name BaseService.create
     * @param {T} item новый элемент
     * @returns {Promise<any | null>}
     */
    async create(item) {
        try {
            await storeDB.addElement(this._storeName, item)
            this._onCreate(item)
            return item
        } catch (err) {
            defaultHandleError(err)
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
    async read(id) {
        try {
            const result = await storeDB.getOne(this._storeName, id)
            this._onRead(id)
            return result
        } catch (err) {
            defaultHandleError(err)
            return null
        }
    }

    /**
     * Метод обновляет данные элемента в бд
     * @method
     * @name BaseService.update
     * @param {T} item id элемента
     * @returns {Promise<any | null>}
     */
    async update(item) {
        try {
            await storeDB.editElement(this._storeName, item)
            this._onUpdate(item)
            return item
        } catch (err) {
            defaultHandleError(err)
            return null
        }
    }

    /**
     * Метод удаляет данные элемента из бд
     * @method
     * @name BaseService.delete
     * @param {T} item удаляемый элемента
     * @returns {Promise<any | null>}
     */
    async delete(item) {
        try {
            await storeDB.removeElement(this._storeName, item.id)
            this._onDelete(item)
            return item
        } catch (err) {
            defaultHandleError(err)
            return null
        }
    }

    /**
     * @method
     * @name BaseService.getCursor
     * @returns {Promise<IDBPCursorWithValue<DBTypes, *[], *[][0], *, "readonly">>}
     */
    async getCursor() {
        return storeDB.cursor(this.storeName)
    }
}
