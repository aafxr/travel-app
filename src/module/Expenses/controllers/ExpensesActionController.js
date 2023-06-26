import constants from "../db/constants";
import expensesModel from '../models/ExpenseModel'
import limitModel from '../models/LimitModel'
import distinctValues from "../../../utils/distinctValues";
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
 * @property {number} expenses_actual
 * @property {number} expenses_planned
 */


export default class {
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
        total && (
            this.totalExpenses = JSON.parse(total) || {
                updated_at: Date.now(),
                limits: [],
                expenses_actual: 0,
                expenses_planned: 0
            }
        )
        this.storeName = constants.store.ACTIONS

        this.expensesActualModel = expensesModel(db, 'actual')
        this.expensesPlanedModel = expensesModel(db, 'planed')
        this.limitModel = limitModel(db, user_id)
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
        const storeName = constants.store.SECTION

        switch (data.action) {
            case 'add':
                await this.db.addElement(storeName, limitData)
                break
            case 'edit':
                await this.db.editElement(storeName, limitData)
                break
            case 'remove':
                await this.db.removeElement(storeName, limitData.id)
                break
            default:
                throw new Error(`[ExpensesActionController._limitHandler] Unexpected action type "${data.action}"`)
        }

        await this.updateTotalExpenses(data)
    }

    async _expanseActualHandler(data) {
        /**@type {import('../models/ExpenseModel').ExpenseType}*/
        const actualData = JSON.parse(data.data)
        const storeName = constants.store.EXPENSES_ACTUAL
        const isAfter = this.isActionAfterUpdate(data)

        switch (data.action) {
            case 'add':
                await this.db.addElement(storeName, actualData)
                isAfter && (this.totalExpenses += actualData.value)
                break
            case 'edit':
                await this.db.editElement(storeName, actualData)
                break
            case 'remove':
                await this.db.removeElement(storeName, actualData.id)
                isAfter && (this.totalExpenses -= actualData.value)
                break
            default:
                throw new Error(`[ExpensesActionController._limitHandler] Unexpected action type "${data.action}"`)
        }

        if (isAfter && data.action !== 'edit'){
            this.updateLS()
        } else{
            await this.updateTotalExpenses(data)
        }
    }

    async _expansePlanedHandler(data) {
        /**@type {import('../models/ExpenseModel').ExpenseType}*/
        const planedData = JSON.parse(data.data)
        const storeName = constants.store.EXPENSES_PLANED
        const isAfter = this.isActionAfterUpdate(data)

        switch (data.action) {
            case 'add':
                await this.db.addElement(storeName, planedData)
                isAfter && (this.totalExpenses += planedData.value)
                break
            case 'edit':
                await this.db.editElement(storeName, planedData)
                break
            case 'remove':
                await this.db.removeElement(storeName, planedData.id)
                isAfter && (this.totalExpenses -= planedData.value)
                break
            default:
                throw new Error(`[ExpensesActionController._limitHandler] Unexpected action type "${data.action}"`)
        }

        if (isAfter && data.action !== 'edit'){
            this.updateLS()
        } else{
            await this.updateTotalExpenses(data)
        }
    }


    isActionAfterUpdate(data) {
        return this.totalExpenses.updated_at < Date.parse(data.datetime);
    }

    updateLS(){
        localStorage.setItem(constants.TOTAL_EXPENSES, JSON.stringify(this.totalExpenses))
    }

    /**
     * пересчитывает актуальные данные расходов
     * @param {ExpensesActionType} data время действия
     */
    async updateTotalExpenses(data) {
        const currentActionDate = Date.parse(data.datetime)
        if (Number.isNaN(currentActionDate)) {
            console.error(`Date format is not correct: ${data.datetime}`)
            return
        }

        const expenses_actual = await this.expensesActualModel.getFromIndex(constants.indexes.PRIMARY_ENTITY_ID, this.primary_entity_id)
        const expenses_planed = await this.expensesPlanedModel.getFromIndex(constants.indexes.PRIMARY_ENTITY_ID, this.primary_entity_id)

        const total_actual = expenses_actual.reduce((acc, item) => item.value + acc, 0)
        const total_planed = expenses_planed.reduce((acc, item) => item.value + acc, 0)

        /**@type {string[]}*/
        const sections_is = distinctValues(expenses_planed, item => item.section_id)

        const promises = []
        sections_is.forEach((section_id) => {
            promises.push(this.limitModel.getLimitWithSection(section_id))
        })

        const limits = await Promise.all(promises)

        localStorage.setItem(constants.TOTAL_EXPENSES, JSON.stringify({
            limits,
            total_planed,
            total_actual,
            updated_at: currentActionDate
        }))
    }

}
