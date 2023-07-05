import Model from '../models/Model';
import constants from '../modules/Expenses/db/constants';
import actionValidationObj from '../modules/Expenses/models/action/validation';
import {LocalDB} from '../db';
import isString from '../utils/validation/isString';

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
 * @property {string} [id]
 * @property {string} [index]
 * @property {ActionVariant} [action]
 * @property {string} storeName
 * @property {string | number | IDBKeyRange} [query]
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
     * @param {ActionVariant} actionVariant
     * @param {function} subscription
     */
    subscribe(modelName, subscription, actionVariant) {
        if (!actionVariant) {
            actions.forEach((a) =>
                this.subscriptions[modelName][a].push(subscription)
            );
        } else if (
            this.modelNames.includes(modelName) &&
            this.subscriptions[modelName] &&
            this.subscriptions[modelName][ActionVariant]
        ) {
            this.subscriptions[modelName][actionVariant].push(subscription);
        } else {
            this._errorMessage(
                new Error(
                    `[Controller.subscription] modelName or actionType not correct: ${modelName}, ${ActionVariant}`
                )
            );
        }
    }


    /**
     * подписка на событие
     * @param {string} modelName
     * @param {function} subscription
     * @param {ActionVariant} actionVariant
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
            this.subscriptions[modelName][ActionVariant]
        ) {
            this.subscriptions[modelName][actionVariant] = this.subscriptions[
                modelName
                ][ActionVariant].filter((sub) => sub !== subscription);
        } else {
            this._errorMessage(
                new Error(
                    `[Controller.subscription] modelName or actionType not correct: ${modelName}, ${ActionVariant}`
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
        }
    }


    /**
     * выводит сообщение в консоль
     * @param {Error} err
     * @private
     */
    _errorMessage(err) {
        console.error(err);
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
                            .catch(err => {
                                throw err
                            })
                        this.update(this, action)
                        this._subscriptionsCall(action, res)
                        console.log('Action result:  ', res);
                    }
                } else {
                    //действия если не синхронизированно
                    this.actionsModel.edit(action)
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
            console.log(this.subscriptions)
            this.subscriptions[entity][actionVariant].forEach((sub) =>
                sub(data)
            );
        }
    }


    /**
     *
     * @param {ControllerPayloadType} payload
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
     * @param {ControllerPayloadType} payload
     */
    read(payload) {
        const {storeName, action, index, id, query} = payload

        if (this.modelNames.includes(payload.storeName)) {
            try {
                if (actions.includes(action)) {
                    return this.model[storeName][action](id || query)
                        .catch(err => {
                            throw err
                        })
                }
                if (index) {
                    return this.model[storeName].getFromIndex(index, query)
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
}
