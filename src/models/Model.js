import {LocalDB} from "../db";
import isString from "../utils/validation/isString";
import isError from "../utils/isError";

/**
 * @typedef {function} validateCallback
 * @param {*} data
 * @returns {boolean}
 */

/**
 * @typedef {object} validateObj
 * @property {validateCallback} [add]
 * @property {validateCallback} [edit]
 * @property {validateCallback} [get]
 * @property {validateCallback} [getFromIndex]
 * @property {validateCallback} [remove]
 */

/**
 * @typedef {string | number | IDBKeyRange} PayloadType
 */


/**
 * @description Model позволяет работать с отдельным хранилищем в бд
 *
 *
 * ================================================
 *
 * Параметры:
 *
 * db экзепляр бд LocalDB
 *
 * ============
 *
 * storeName имя хранилища с которым буде работать данная Model (напирмер бд Expenses хранилище Limits)
 *
 * ============
 *
 * validation функция или обект для валидации записываемых в хранилище данных
 *
 * если функция вызывается на все методы где данные записываются в бд
 *
 * если Объект валидация вызываеться для каждого метода для которого указанна
 *
 * ================================================
 *
 * Методы Model:
 *
 * add
 *
 * get
 *
 * getFormIndex
 *
 * edit
 *
 * remove
 *
 * все методы возвращают промис с результатом операции. Результат операции зависит от query (id или IDBKeyRange)
 *
 */
export default class Model {


    /**
     * Model позволяет работать с отдельным хранилищем (storeName)
     * @param {import('../db').LocalDB} db - локальная база данных (indexeddb)
     * @param {string} storeName - имя хранилища
     * @param {validateCallback | validateObj}validation
     */
    constructor(db, storeName, validation) {
        if (
            db instanceof LocalDB
            && isString(storeName)
        ) {
            this.db = db;
            this.storeName = storeName;
            typeof validation === 'function' && (this.validateCB = validation)
            typeof validation === 'object' && (this.validateObj = validation)
        } else {
            throw new Error('[Model] Some of args in constructor not correct')
        }
    }



    /**
     * валидация данных согласно переданному в конструктор методу или объекту валидации
     * @param {*} data
     * @param {'add' | 'edit' | 'get' | 'getFromIndex' | 'remove'} methodType
     * @returns {boolean}
     * @private
     */
    _validate(data, methodType){
        if (this.validateCB){
            return !!this.validateCB(data)
        } else if(this.validateObj && this.validateObj[methodType]){
            return !! this.validateObj[methodType](data)
        }
        return true;
    }


    /**
     * @param {*} data
     * @private
     */
    _notCorrectDataMessage(data){
        console.error(`[Model] Received data is not correct: `, data)
    }


    /**
     * @param err
     * @returns {*}
     * @private
     */
    _printErrorMessage(err){
        console.error('[Model] DB error ', err)
        return err
    }


    /**
     * добавляет в бд -> в хранилище storeName данные (payload)
     * @param {*} payload
     * @returns {Promise<undefined|*|number|string|Date|ArrayBufferView|ArrayBuffer|IDBValidKey[]>}
     */
    async add(payload){
        if(this._validate(payload, 'add')){
            const res = await this.db.addElement(this.storeName, payload)
            return isError(res) ? this._printErrorMessage(res) && undefined : res
        }
        this._notCorrectDataMessage(payload)
        return undefined
    }


    /**
     * редактирует в бд -> в хранилище storeName данные (payload)
     * @param {*} payload
     * @returns {Promise<undefined|*|number|string|Date|ArrayBufferView|ArrayBuffer|IDBValidKey[]>}
     */
    async edit(payload){
        if (this._validate(payload, 'edit')){
            const res = await this.db.editElement(this.storeName, payload)
            return isError(res) ? this._printErrorMessage(res) && undefined : res
        }
        this._notCorrectDataMessage(payload)
        return undefined
    }


    /**
     * поиск по параметру query в бд -> в хранилище storeName данных
     * @param {PayloadType} query
     * @returns {Promise<undefined|*>}
     */
    async get(query){
        if (this._validate(query, 'get')){
            const res = await this.db.getElement(this.storeName, query)
            return isError(res) ? this._printErrorMessage(res) && undefined : res
        }
        this._notCorrectDataMessage(query)
        return undefined
    }


    /**
     * поиск по indexName по параметру query в бд -> в хранилище storeName данных
     * @param {string} indexName
     * @param {PayloadType} query
     * @returns {Promise<undefined|*>}
     */
    async getFromIndex(indexName, query){
        if (this._validate(query, 'getFromIndex')){
            const res = await this.db.getFromIndex(this.storeName,indexName, query)
            return isError(res) ? this._printErrorMessage(res) && undefined : res
        }
        this._notCorrectDataMessage(query)
        return undefined
    }


    /**
     * удаляет из бд -> из хранилища storeName данные
     * @param {PayloadType} query
     * @returns {Promise<*|undefined|void>}
     */
    async remove(query){
        if (this._validate(query, 'remove')){
            const res = await this.db.removeElement(this.storeName, query)
            return isError(res) ? this._printErrorMessage(res) && undefined : res
        }
        this._notCorrectDataMessage(query)
        return undefined
    }
}