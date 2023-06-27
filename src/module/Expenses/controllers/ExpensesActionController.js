import constants from "../db/constants";
import distinctValues from "../../../utils/distinctValues";
import Model from "../../../model/Model";

import expenseValidationObj from '../models/expenses/validation'
import limitValidationObj from '../models/limit/validation'
import actionValidationObj from '../models/action/validation'
import sectionValidationObj from '../models/section/validation'
import accumulate from "../../../utils/accumulate";
/**
 * @typedef {object} ExpensesActionType
 * @property {string} [id]
 * @property {string} uid
 * @property {string} datetime
 * @property {'limit' |'expenses_actual' |'expenses_plan'} entity
 * @property {'add' | 'edit' | 'remove'} action
 * @property {string} data
 * @property {boolean | number} synced
 */

/**
 * @typedef {object} LimitsType
 * @property {string} limit_id
 * @property {string} limit_name
 * @property {number} limit_value
 */

/**
 * @typedef {object} TotalExpensesType
 * @property {number} updated_at
 * @property {Array.<LimitsType>} limits
 * @property {number} total_actual
 * @property {number} total_planed
 */


export default class ExpensesActionController {
    /**
     * обрработка поступающих Action
     * @constructor
     * @param {import('../../../db').LocalDB} db
     * @param {string} user_id
     * @param {string} primary_entity_id
     */
    constructor(db, user_id, primary_entity_id) {
        this.db = db
        this.primary_entity_id = primary_entity_id;
        this.user_id = user_id

        const total = localStorage.getItem(constants.TOTAL_EXPENSES)

        /**@type {TotalExpensesType | null}*/
        this.totalExpenses = JSON.parse(total) || {
            updated_at: Date.now(),
            limits: [],
            total_actual: 0,
            total_planed: 0
        }
        this.storeName = constants.store.ACTIONS

        this.expensesActualModel = new Model(db, constants.store.EXPENSES_ACTUAL, expenseValidationObj)
        this.expensesPlanedModel = new Model(db, constants.store.EXPENSES_PLANED, expenseValidationObj)
        this.limitModel = new Model(db, constants.store.SECTION_LIMITS, limitValidationObj)
        this.sectionModel = new Model(db, constants.store.SECTION, sectionValidationObj)
        this.actionsModel = new Model(db, constants.store.ACTIONS, actionValidationObj)

        this.updateTotalExpenses()
    }


    /**
     *
     * @param {ExpensesActionType} data
     * @returns {ExpensesActionType}
     */
    createAction(data, payload) {
        data.data = JSON.stringify(payload)
        return data
    }

    /**
     * обработка поступившего события
     * @param {ExpensesActionType} data
     */
    handleAction(data) {
        if (data.synced) {
            switch (data.entity) {
                case "limit":
                    return this._limitHandler(data)
                case "expenses_actual":
                    return this._expanseActualHandler(data)
                case "expenses_plan":
                    return this._expansePlanedHandler(data)
                default:
                    console.error(`[ExpensesActionController] Unexpected action entity ${data.entity}`)
            }
        } else {
            this.db.addElement(this.storeName, data)
        }
    }

    /**
     *
     * @param {ExpensesActionType} data
     * @returns {Promise<void>}
     * @private
     */
    async _limitHandler(data) {
        /**@type {import('../models/LimitModel').LimitType}*/
        const limitData = JSON.parse(data.data)

        switch (data.action) {
            case 'add':
                await this.limitModel.add(limitData)
                break
            case 'edit':
                await this.limitModel.edit(limitData)
                break
            case 'remove':
                await this.limitModel.remove(limitData.id)
                break
            default:
                throw new Error(`[ExpensesActionController._limitHandler] Unexpected action type "${data.action}"`)
        }

        await this.updateTotalExpenses(data)
    }

    async _expanseActualHandler(data) {
        /**@type {import('../models/ExpenseModel').ExpenseType}*/
        const actualData = JSON.parse(data.data)
        const isAfter = this._isActionAfterUpdate(data)

        switch (data.action) {
            case 'add':
                await this.expensesActualModel.add(actualData)
                isAfter && (this.totalExpenses.total_actual += actualData.value)
                break
            case 'edit':
                await this.expensesActualModel.edit(actualData)
                break
            case 'remove':
                await this.expensesActualModel.remove(actualData.id)
                isAfter && (this.totalExpenses.total_actual -= actualData.value)
                break
            default:
                throw new Error(`[ExpensesActionController._limitHandler] Unexpected action type "${data.action}"`)
        }

        if (isAfter && data.action !== 'edit') {
            this.updateLS()
        } else {
            await this.updateTotalExpenses(data)
        }
    }

    async _expansePlanedHandler(data) {
        /**@type {import('../models/ExpenseModel').ExpenseType}*/
        const planedData = JSON.parse(data.data)
        const isAfter = this._isActionAfterUpdate(data)

        switch (data.action) {
            case 'add':
                await this.expensesPlanedModel.add(planedData)
                isAfter && (this.totalExpenses.total_planed += planedData.value)
                break
            case 'edit':
                await this.expensesPlanedModel.edit(planedData)
                break
            case 'remove':
                await this.expensesPlanedModel.remove(planedData.id)
                isAfter && (this.totalExpenses.total_planed -= planedData.value)
                break
            default:
                throw new Error(`[ExpensesActionController._limitHandler] Unexpected action type "${data.action}"`)
        }

        if (isAfter && data.action !== 'edit') {
            this.updateLS()
        } else {
            await this.updateTotalExpenses(data)
        }
    }


    _isActionAfterUpdate(data) {
        return this.totalExpenses.updated_at < Date.parse(data.datetime);
    }

    updateLS() {
        this.totalExpenses.updated_at = Date.now()
        localStorage.setItem(constants.TOTAL_EXPENSES, JSON.stringify(this.totalExpenses))
    }

    /**
     * пересчитывает актуальные данные расходов
     * @param {ExpensesActionType} data время действия
     */
    async updateTotalExpenses(data) {
        /**@type {number} */
        let updated_at = Date.now()

        const expenses_actual = await this.expensesActualModel.getFromIndex(constants.indexes.PRIMARY_ENTITY_ID, IDBKeyRange.only(this.primary_entity_id))
        const expenses_planed = await this.expensesPlanedModel.getFromIndex(constants.indexes.PRIMARY_ENTITY_ID, this.primary_entity_id)

        const total_actual = accumulate(expenses_actual, item => item.value)
        const total_planed = accumulate(expenses_planed, item => item.value)

        /**@type {string[]}*/
        const sections_ids = distinctValues(expenses_planed, item => item.section_id)


        const limits = []
        for (const section_id of sections_ids) {
            const section = await this.sectionModel.get(section_id)
            const limit = await this.limitModel.getFromIndex(constants.indexes.SECTION_ID, section_id)
            limit && section && limits.push(
                {
                    section_id,
                    title: section.title,
                    value: limit.value
                }
            )
        }

        localStorage.setItem(constants.TOTAL_EXPENSES, JSON.stringify({
            limits,
            total_planed,
            total_actual,
            updated_at
        }))
    }

}
