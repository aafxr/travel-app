import {LocalDB} from "../db/LocalDB";
import isString from "../utils/validation/isString";
import isError from "../utils/isError";
import ErrorReport from "../controllers/ErrorReport";

/**
 * @typedef {function} validateCallback
 * @param {*} data
 * @returns {boolean}
 */

/**
 * @typedef {object} validateObj
 * @property {validateCallback} [add]
 * @property {validateCallback} [update]
 * @property {validateCallback} [get]
 * @property {validateCallback} [getFromIndex]
 * @property {validateCallback} [remove]
 */

/**
 * @typedef {string | number | IDBKeyRange} PayloadType
 */


/**
 * @description __Model__ позволяет работать с отдельным хранилищем в бд
 *
 *
 * ***
 *
 * __Параметры__:
 *
 * - storeDB экзепляр бд LocalDB
 *
 * ***
 *
 * - storeName имя хранилища с которым буде работать данная Model (напирмер бд Expenses хранилище Limits)
 *
 * ***
 *
 * - validation функция или обект для валидации записываемых в хранилище данных
 * если функция вызывается на все методы где данные записываются в бд
 * если Объект валидация вызываеться для каждого метода для которого указанна
 *
 * ***
 *
 * __Методы Model__:
 *
 * - add
 * - get
 * - getFormIndex
 * - update
 * - remove
 * ***
 * все методы возвращают промис с результатом операции. Результат операции зависит от query (id или IDBKeyRange)
 *
 * @class
 * @name Model
 * @constructor
 * @param {import('../db/LocalDB').LocalDB} db - локальная база данных (indexeddb)
 * @param {string} storeName - имя хранилища
 * @param {validateCallback | validateObj}validation
 */
export default class Model {
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
            throw new Error('[Model.constructor] Some of args in constructor not correct')
        }
    }


    /**
     * валидация данных согласно переданному в конструктор методу или объекту валидации
     * @method Model.validate
     * @param {*} data
     * @param {'add' | 'update' | 'get' | 'getFromIndex' | 'remove'} methodType
     * @returns {boolean}
     */
    validate(data, methodType) {
        if (this.validateCB) {
            return !!this.validateCB(data)
        } else if (this.validateObj && this.validateObj[methodType]) {
            return !!this.validateObj[methodType](data)
        }
        return true;
    }


    /**
     * Метод выводит сообщение о не корректно принятых данных
     * @method Model._notCorrectDataMessage
     * @param data данные которые были переданны в один из методов Model
     * @private
     */
    _notCorrectDataMessage(data) {
        console.warn(`[Model] Received data is not correct: `, data)
    }

    /**
     * Метод реализует отправку сообщений об ошибке
     * @method Model._sendReport
     * @param {Error} err
     * @private
     */
    _sendReport(err) {
        ErrorReport.sendReport(err).catch(console.error)
    }


    /**
     * Метод обрабатывает ошибки, возникшие в процессе работы с бд
     * @method Model._printErrorMessage
     * @param {Error} err
     * @returns {Error}
     * @private
     */
    _printErrorMessage(err) {
        console.error('[Model] DB error ', err)
        return err
    }


    /**
     * добавляет в бд -> в хранилище storeName данные (payload)
     * @method Model.add
     * @param {*} payload
     * @returns {Promise<undefined|*|number|string|Date|ArrayBufferView|ArrayBuffer|IDBValidKey[]>}
     */
    async add(payload) {
        try {
            if (this.validate(payload, 'add')) {
                const res = await this.db.editElement(this.storeName, payload)
                return isError(res) ? this._printErrorMessage(res) && undefined : res
            }
            this._notCorrectDataMessage(payload)
            return undefined
        } catch (err) {
            this._sendReport(new Error(`[Model.add/${this.storeName}] ` + err))
        }
    }


    /**
     * редактирует в бд -> в хранилище storeName данные (payload)
     * @method Model.update
     * @param {*} payload
     * @returns {Promise<undefined|*|number|string|Date|ArrayBufferView|ArrayBuffer|IDBValidKey[]>}
     */
    async update(payload) {
        try {
            if (this.validate(payload, 'update')) {
                return await this.db.editElement(this.storeName, payload)
            }
            this._notCorrectDataMessage(payload)
            return undefined
        } catch (err) {
            this._sendReport(new Error(`[Model.update]${this.storeName}] ` + err))
        }
    }


    /**
     * поиск по параметру query в бд -> в хранилище storeName данных
     * @method Model.get
     * @param {PayloadType} query
     * @returns {Promise<undefined|*>}
     */
    async get(query) {
        try {
            if (this.validate(query, 'get')) {
                const res = await this.db.getElement(this.storeName, query)
                return isError(res) ? this._printErrorMessage(res) && undefined : res
            }
            this._notCorrectDataMessage(query)
            return undefined
        } catch (err) {
            this._sendReport(new Error(`[Model.get/${this.storeName}] ` + err))
        }
    }


    /**
     * поиск по indexName по параметру query в бд -> в хранилище storeName данных
     * @param {string} indexName
     * @param {PayloadType} query
     * @returns {Promise<undefined|*>}
     */
    async getFromIndex(indexName, query) {
        try {
            if (this.validate(query, 'getFromIndex')) {
                const res = await this.db.getFromIndex(this.storeName, indexName, query)
                return isError(res) ? this._printErrorMessage(res) && undefined : res
            }
            this._notCorrectDataMessage(query)
            return undefined
        } catch (err) {
            this._sendReport(new Error(`[Model.getFromIndex/${this.storeName}] ` + err))
        }
    }


    /**
     * удаляет из бд -> из хранилища storeName данные
     * @method Model.remove
     * @param {PayloadType} query
     * @returns {Promise<*|undefined|void>}
     */
    async remove(query) {
        try {
            if (this.validate(query, 'remove')) {
                return await this.db.removeElement(this.storeName, query)
            }
            this._notCorrectDataMessage(query)
            return undefined
        } catch (err) {
            this._sendReport(new Error(`[Model.remove/${this.storeName}] ` + err))
        }
    }
}