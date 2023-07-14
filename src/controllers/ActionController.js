import Model from '../models/Model';
import constants from '../modules/Expenses/db/constants';
import actionValidationObj from '../modules/Expenses/models/action/validation';
import {LocalDB} from '../db';
import isString from '../utils/validation/isString';
import ErrorReport from "./ErrorReport";

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
            this.subscriptions[mn] = {};
            actions.forEach((action) => {
                this.subscriptions[mn][action] = [];
            });
        });

        this.storeName = options.storeName;
    }


    /**
     * подписка на событие
     * @param {string} modelName
     * @param {function} subscription
     * @param {ActionVariant} [actionVariant]
     */
    subscribe(modelName, subscription, actionVariant) {
        if (!actionVariant) {
            actions.forEach((a) =>
                !this.subscriptions[modelName][a].includes(subscription) && this.subscriptions[modelName][a].push(subscription)
            );
        } else if (
            this.modelNames.includes(modelName)
            && this.subscriptions[modelName]
            && this.subscriptions[modelName][actionVariant]
            && !this.subscriptions[modelName][actionVariant].includes(subscription)
        ) {
            this.subscriptions[modelName][actionVariant].push(subscription);
        } else {
            this._errorMessage(
                new Error(
                    `[Controller.subscription] modelName or actionType not correct: ${modelName}, ${actionVariant}`
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
        if (!actionVariant) {
            actions.forEach((a) => {
                this.subscriptions[modelName][a] = this.subscriptions[modelName][
                    a
                    ].filter((sub) => sub !== subscription);
            });
        } else if (
            this.modelNames.includes(modelName) &&
            this.subscriptions[modelName] &&
            this.subscriptions[modelName][actionVariant]
        ) {
            this.subscriptions[modelName][actionVariant] = this.subscriptions[
                modelName
                ][actionVariant].filter((sub) => sub !== subscription);
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

    set onSendData(cb) {
        if (typeof cb === 'function') {
            this.send = cb
            this.actionsModel.get('all')
                .then(actions => {
                    if (actions) {
                        if (Array.isArray(actions)) {
                            actions.forEach(a => this.send(a))
                        } else {
                            this.send(actions)
                        }
                    }
                })
        }
    }


    /**
     * выводит сообщение в консоль
     * @param {Error} err
     * @private
     */
    _errorMessage(err) {
        console.error(err);
        ErrorReport.sendError(err).catch(console.error)
    }


    /**
     *
     * @param {ActionType} action
     */
    isActionValid(action) {
        let isValid = true;

        if (!isString(action.uid)) {
            isValid = false;
            console.error('[Action validation] uid ', action.uid);
        }

        if (!actions.includes(action.action)) {
            isValid = false;
            console.error('[Action validation] action ', action.action);
        }

        if (!this.modelNames.includes(action.entity)) {
            isValid = false;
            console.error('[Action validation] entity ', action.entity);
        }

        if (Number.isNaN(Date.parse(action.datetime))) {
            isValid = false;
            console.error('[Action validation] entity ', action.datetime);
        }

        return isValid;
    }

    /**
     * принимает и обрабаиывает события
     * @param {ActionType} action
     */
    async actionHandler(action) {
        try {
            if (this.isActionValid(action)) {
                const {action: actionVariant, synced, entity, data} = action;
                const parsedData = JSON.parse(data);
                if (synced) {
                    if (this.model[entity] && this.model[entity][actionVariant]) {
                        const res = await this.model[entity][actionVariant](parsedData)
                        // if(entity === 'limit')
                        //     debugger
                        this.update(this, action)
                        this._subscriptionsCall(action, res)
                    }
                    await this.actionsModel.remove(action.id)
                } else {
                    //действия если не синхронизированно
                    await this.actionsModel.edit(action)

                    this.send(action)
                }
            }
        } catch (err) {
            this._errorMessage(err);
        }
    }


    /**
     * оповещает поддписчиков об изменении данных
     * @param {ActionType} action
     * @param {*} data
     * @private
     */
    _subscriptionsCall(action, data) {
        const {action: actionVariant, entity} = action;
        if (this.model[entity] && this.model[entity][actionVariant]) {
            this.subscriptions[entity][actionVariant].forEach((sub) =>
                sub(data)
            );
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
                } else  {
                    return this.model[storeName]['get'](id || query)
                        .catch(err => {
                            throw err
                        })
                }
                return Promise.resolve(null)
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
    getStoreModel(storeName){
        if (this.modelNames.includes(storeName)){
            return this.model[storeName]
        }
        return null
    }
}
