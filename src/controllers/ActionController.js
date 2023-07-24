import Model from '../models/Model';
import constants from '../modules/Expenses/db/constants';
import actionValidationObj from '../modules/Expenses/models/action/validation';
import {LocalDB} from '../db';
import isString from '../utils/validation/isString';
import ErrorReport from "./ErrorReport";
import toArray from "../utils/toArray";

/**
 * @callback CB
 * @param {import('../db').LocalDB}
 * @returns {import('../models/Model').default}
 */

/**
 * @typedef {Object.<string, CB>} ModelOption
 */

/**
 * @typedef {'add' | 'edit' | 'get' | 'remove'} ActionVariant
 */

/**
 * @typedef {Object.<string, any>} AnyObj
 */

/**
 * @typedef {object} ActionType
 * @property {string} [id]
 * @property {string} uid
 * @property {string} datetime
 * @property {string} entity
 * @property {ActionVariant} action
 * @property {string} data
 * @property {boolean | number} synced
 */

/**
 * @typedef {object} Payload
 * @property {string} storeName
 * @property {string} [id]
 * @property {string} [index]
 * @property {string | number | IDBKeyRange} [query]
 * @property {ActionVariant} [action]
 * @property {*} data
 */

/**
 * @typedef {object} ReadPayloadType
 * @property {string} storeName
 * @property {string} [id]
 * @property {string} [index]
 * @property {string | number | IDBKeyRange} [query]
 */

/**
 * @typedef {object} WritePayloadType
 * @property {string} storeName
 * @property {ActionVariant} action
 * @property {string} user_id
 * @property {*} data
 */

/**
 * @typedef {Payload & AnyObj} ControllerPayloadType
 */


/**
 * @description функция принимает payload должна вернуть новый action
 * @function
 * @name CreateAction
 * @param {ControllerPayloadType} payload
 * @returns {ActionType}
 */

/**
 * @callback UpdateFunction
 * @param {ActionController} controller
 * @param {ActionType} [action]
 */

/**
 * @typedef {object} OptionsType
 * @property {ModelOption} models
 * @property {string} storeName - имя хранилища для actions
 * @property {UpdateFunction} [onUpdate]
 * @property {CreateAction} newAction
 * @property {function} onReady
 * @property {function} onError
 * @property {function} onSendData
 */





const actions = ['add', 'edit', 'get', 'remove'];

export default class ActionController {
    /**
     *
     * @param {import('../db').DBSchemaType} dbSchema
     * @param {OptionsType} options
     */
    constructor(dbSchema, options) {
        this.db = new LocalDB(dbSchema, {
            onReady: options.onReady || (() => {
            }),
            onError: options.onError || (() => {
            })
        });

        this.actionsModel = new Model(
            this.db,
            constants.store.ACTIONS,
            actionValidationObj
        );

        this.update = options.onUpdate || (() => {
        })
        this.send = options.onSendData || (() => {
        })

        !options.newAction && console.warn('[ActionController] you need to specify a function "newAction"')
        /**@returns {ActionType} */
        this.createAction = options.newAction || (() => {
        })

        this.model = {};
        this.subscriptions = {};
        this.modelNames = options.models ? Object.keys(options.models) : [];

        this.modelNames.forEach((mn) => {
            this.model[mn] = options.models[mn](this.db);
            this.subscriptions[mn] = [];
        });

        this.storeName = options.storeName;
        this.onLine = navigator.onLine
    }


    /**
     * подписка на событие
     * @param {string} modelName
     * @param {function} subscription
     */
    subscribe(modelName, subscription) {
        if (this.modelNames.includes(modelName)) {
            this.subscriptions[modelName] && this.subscriptions[modelName].push(subscription)
        } else {
            this._errorMessage(
                new Error(
                    `[Controller.subscription] modelName or actionType not correct: ${modelName}`
                )
            );
        }
    }


    /**
     * подписка на событие
     * @param {string} modelName
     * @param {function} subscription
     * @param {ActionVariant} [actionVariant]
     */
    unsubscribe(modelName, subscription, actionVariant) {
        if (this.modelNames.includes(modelName)) {
            this.subscriptions[modelName] = this.subscriptions[modelName]
                .filter((sub) => sub !== subscription);
        } else {
            this._errorMessage(
                new Error(
                    `[Controller.subscription] modelName or actionType not correct: ${modelName}, ${actionVariant}`
                )
            );
        }
    }


    /**
     * set колбэк вызывается если были изменения в бд
     * @param {function} cb
     */
    set onUpdate(cb) {
        if (typeof cb === 'function') {
            this.update = cb
            this.update(this)
        }
    }


    /**
     * отправляет не синхронизированные actions на сервер
     * @param cb
     */
    set onSendData(cb) {
        if (typeof cb === 'function') {
            this.send = cb
            this.actionsModel.get('all')
                .then(actions => this.send(toArray(actions)))
        }
    }


    /**
     * выводит сообщение в консоль
     * @param {Error} err
     * @private
     */
    _errorMessage(err) {
        console.error(err);
        ErrorReport.sendError(new Error('[ActionController] ' + err)).catch(console.error)
    }


    /**
     *
     * @param {ActionType} action
     */
    isActionValid(action) {
        let isValid = true;

        if (!isString(action.uid)) {
            isValid = false;
            console.warn('[Action validation] uid ', action.uid);
        }

        if (!actions.includes(action.action)) {
            isValid = false;
            console.warn('[Action validation] action ', action.action);
        }

        if (!this.modelNames.includes(action.entity)) {
            isValid = false;
            console.warn('[Action validation] entity ', action.entity);
        }

        if (Number.isNaN(Date.parse(action.datetime))) {
            isValid = false;
            console.warn('[Action validation] entity ', action.datetime);
        }

        return isValid;
    }

    /**
     * принимает и обрабаиывает события
     * @param {ActionType} actions
     */
    async actionHandler(actions) {
        try {
            this.onLine = navigator.onLine
            const actionsArr = toArray(actions)
            const entityList = new Set(actionsArr.map(a => a.entity))
            const actionsQueue = []
            let isModified = false

            for (const action of actionsArr) {
                if (this.isActionValid(action)) {
                    const {action: actionVariant, synced, entity, data} = action;

                    if (this.model[entity].validate(data)) {
                        if (this.model[entity] && this.model[entity][actionVariant] && data) {
                            await this.model[entity][actionVariant](actionVariant === 'remove' ? data.id : data)
                            isModified = true
                        }
                    }

                    if (synced) {
                        await this.actionsModel.edit(action)
                    } else {
                        //действия если не синхронизированно
                        await this.actionsModel.edit(action)
                        actionsQueue.push(action)
                    }
                }
            }
            if (isModified) {
                this.update(this)
                for (const entity of entityList.keys()) {
                    this._subscriptionsCall(entity)
                    console.log({
                        type: 'update',
                        storeName: entity
                    })
                    postMessage({
                        type: 'update',
                        storeName: entity
                    })
                }
            }
            actionsQueue.length && this.send(actionsQueue)
            !this.onLine && this.whileOffline()
        } catch (err) {
            this._errorMessage(err);
        }
    }


    /**
     * оповещает поддписчиков об изменении данных
     * @param {string} entity
     * @private
     */
    _subscriptionsCall(entity) {
        if (this.model[entity]) {
            this.subscriptions[entity].forEach((sub) => sub());
        }
    }


    /**
     *
     * @param {WritePayloadType} payload
     */
    write(payload) {
        try {
            if (this.modelNames.includes(payload.storeName)) {
                /**@type{ActionType}*/
                const action = this.createAction(payload)
                return this.actionHandler(action)
            } else {
                this._errorMessage(new Error(`[ActionController] storeName "${payload.storeName}" not correct`))
                return Promise.resolve(null)
            }
        } catch (err) {
            this._errorMessage(err)
            return Promise.resolve(null)
        }
    }


    /**
     *
     * @param {ReadPayloadType} payload
     */
    read(payload) {
        const {storeName, index, id, query} = payload

        if (this.modelNames.includes(payload.storeName)) {
            try {
                if (index) {
                    return this.model[storeName].getFromIndex(index, query)
                        .catch(err => {
                            throw err
                        })
                } else {
                    return this.model[storeName]['get'](id || query)
                        .catch(err => {
                            throw err
                        })
                }
            } catch (err) {
                this._errorMessage(err)
            }
        } else {
            this._errorMessage(new Error(`[ActionController] storeName "${payload.storeName}" not correct`))
            return Promise.resolve(null)
        }
    }


    /**
     * возвра
     * @param storeName
     * @returns {*|null}
     */
    getStoreModel(storeName) {
        if (this.modelNames.includes(storeName)) {
            // return this.model[storeName]

            return new Proxy(this.model[storeName], {
                get(target, prop, receiver) {
                    if (target[prop]) {
                        if (typeof target[prop] === 'function') {
                            try {
                                return target[prop].bind(target)
                            } catch (err) {
                                ErrorReport.sendError(err).catch(console.error)
                                console.error(err)
                            }
                        } else {
                            return target[prop]
                        }
                    }
                }
            })
        }
        return null
    }


    /**
     * метод ожидает востановления сети и отправляет накопившиеся actions на сервер
     */
    whileOffline() {
        if (!this.offlineId) {
            this.offlineId = setInterval(async () => {
                if (navigator.onLine) {
                    const actions = await this.actionsModel.getFromIndex(constants.indexes.SYNCED, 0)
                    console.log('Not synced actions: ', actions)
                    this.onLine = true
                    clearInterval(this.offlineId)
                    await this.actionHandler(actions)
                }
            }, 2000)
        }
    }
}
