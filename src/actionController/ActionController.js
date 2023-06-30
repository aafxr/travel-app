import Model from "../model/Model";
import constants from "../module/Expenses/db/constants";
import actionValidationObj from "../module/Expenses/models/action/validation";
import {LocalDB} from "../db";
import isString from "../utils/validation/isString";

/**
 * @callback CB
 * @param {import('../db').LocalDB}
 * @returns {import('../model/Model').default}
 */

/**
 * @typedef {Object.<string, CB>} ModelOption
 */

/**
 * @typedef {'add' | 'edit' | 'remove'} ActionVariant
 */


/**
 * @typedef {object} OptionsType
 * @property {ModelOption} models
 * @property {string} storeName - имя хранилища для actions
 * @property {function} onUpdate
 */


/**
 * @typedef {object} ActionType
 * @property {string} [id]
 * @property {string} uid
 * @property {string} datetime
 * @property {string} entity
 * @property {'add' | 'edit' | 'remove'} action
 * @property {string} data
 * @property {boolean | number} synced
 */


/**
 *
 * @type {{models: ModelOption}}
 */
const options = {
    /**@type {ModelOption} */
    models: {},

}


const actions = ['add', 'edit', 'remove']


export default class ActionController {


    /**
     *
     * @param {import('../db').DBSchemaType} dbSchema
     * @param {OptionsType} options
     */
    constructor(dbSchema, options) {
        this.db = new LocalDB(dbSchema, {})
        this.actionsModel = new Model(this.db, constants.store.ACTIONS, actionValidationObj)

        this.model = {}
        this.subscriptions = {}
        this.modelNames = options.models ? Object.keys(options.models) : []

        this.modelNames.forEach(mn => {
            this.model[mn] = options.models[mn](this.db)
            actions.forEach(action => {
                this.subscriptions[mn] = {}
                this.subscriptions[mn][action] = []
            })
        })

        this.storeName = options.storeName
    }


    /**
     * подписка на событие
     * @param {string} modelName
     * @param {ActionVariant} actionVariant
     * @param {function} subscription
     */
    subscribe(modelName, subscription, actionVariant) {
        if (!actionVariant) {
            actions.forEach(a => this.subscriptions[modelName][a].push(subscription))
        } else if (
            this.modelNames.includes(modelName)
            && this.subscriptions[modelName]
            && this.subscriptions[modelName][ActionVariant]
        ) {
            this.subscriptions[modelName][actionVariant].push(subscription)
        } else {
            this._errorMessage(new Error(`[Controller.subscription] modelName or actionType not correct: ${modelName}, ${ActionVariant}`))
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
            actions.forEach(a => {
                this.subscriptions[modelName][a] = this.subscriptions[modelName][a]
                    .filter(sub => sub !== subscription)
            })
        } else if (
            this.modelNames.includes(modelName)
            && this.subscriptions[modelName]
            && this.subscriptions[modelName][ActionVariant]
        ) {
            this.subscriptions[modelName][actionVariant] = this.subscriptions[modelName][ActionVariant]
                .filter(sub => sub !== subscription)
        } else {
            this._errorMessage(new Error(`[Controller.subscription] modelName or actionType not correct: ${modelName}, ${ActionVariant}`))
        }
    }


    /**
     * выводит сообщение в консоль
     * @param {Error} err
     * @private
     */
    _errorMessage(err) {
        console.error(err)
    }


    /**
     *
     * @param {ActionType} action
     */
    isActionValid(action) {
        let isValid = true

        if (isString(action.uid)) {
            isValid = false
            console.error('[Action validation] uid ', action.uid)
        }

        if (actions.includes(action.action)) {
            isValid = false
            console.error('[Action validation] action ', action.action)
        }

        if (this.modelNames.includes(action.entity)) {
            isValid = false
            console.error('[Action validation] entity ', action.entity)
        }

        if (!Number.isNaN(Date.parse(action.datetime))) {
            isValid = false
            console.error('[Action validation] entity ', action.datetime)
        }

        return isValid
    }


    /**
     * принимает и обрабаиывает события
     * @param {ActionType} action
     */
    async actionHandler(action) {
        try {
            if (this.isActionValid(action)) {
                const {action: actionVariant, synced, entity, data} = action
                const parsedData = JSON.parse(data)

                if (synced) {
                    if (this.model[entity] && this.model[entity][actionVariant]) {
                        const res = await this.model[entity][actionVariant](parsedData)
                        this.subscriptions[entity][actionVariant].forEach(sub => sub(res))
                        console.log('Action result:  ', res)
                    }
                } else {
                    //действия если не синхронизированно
                }
            }

        } catch (err) {
            this._errorMessage(err)
        }
    }


    _subscriptionsCall(action) {
    }


}