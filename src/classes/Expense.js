import createId from "../utils/createId";
import constants from "../static/constants";
import {expenses_actual_service, expenses_plan_service} from "../services/expenses_service";

/**
 * данный класс позволяет работать с расходами
 * @class
 * @name Expense
 *
 * @param {ExpenseType} item прошлая запись о расзоде (если есть)
 * @param {string} user_id id пользователя, создавшего запись о расходе
 * @param {'plan' | 'actual'} type тип расходов
 * @constructor
 *
 */
export default class Expense {
    /**@type{ExpenseType}*/
    static initValue = {
        id: () => '',
        section_id: () => '',
        user_id: () => '',
        personal: () => 0,
        title: () => '',
        value: () => 0,
        primary_entity_id: () => '',
        created_at: () => new Date().toISOString(),
        datetime: () => new Date().toISOString(),
        entity_id: () => '',
        entity_type: () => '',
        primary_entity_type: () => '',
    }
    newExpense = false
    /**
     * @param {ExpenseType} item прошлая запись о расзоде (если есть)
     * @param {string} user_id id пользователя, создавшего запись о расходе
     * @param {'plan' | 'actual'} type тип расходов
     * @constructor
     */
    constructor(item, user_id, type) {
        if (!item) {
            item = {}
            this.newExpense = true
        }

        /***@type{ExpenseType}*/
        this._modified = {}

        Object.keys(Expense.initValue).forEach(key => this._modified[key] = Expense.initValue[key]())
        this
            .setID(item.id)
            .setSectionId(item.section_id)
            .setUserID(item.user_id)
            .setPersonal(item.personal)
            .setTitle(item.title)
            .setValue(item.value)
            .setPrimaryEntityID(item.primary_entity_type)
            .setCreatedAt(item.created_at)
            .setDatetime(item.datetime)
            .setEntityID(item.entity_id)
            .setEntityType(item.entity_type)
            .setPrimaryEntityType(item.primary_entity_type)

        this.change = this.newExpense
        this.type = type
        if(type === 'actual')   this.storeName = constants.store.EXPENSES_ACTUAL
        if(type === 'plan')     this.storeName = constants.store.EXPENSES_PLAN

    }

    /**
     * геттер возвращает id расхода
     * @get
     * @name Expense.id
     * @returns {string}
     */
    get id(){
        return this._modified.id
    }

    /**
     * метод устанавливает id расхода
     * @method
     * @name Expense.setID
     * @param {string} id id расхода
     * @returns {Expense}
     */
    setID(id){
        if(typeof id === 'string' && id.length > 0) {
            this._modified.section_id = id
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает section_id
     * @get
     * @name Expense.section_id
     * @returns {string}
     */
    get section_id(){
        return this._modified.section_id
    }

    /**
     * метод устанавливает id секции
     * @method
     * @name Expense.setSectionId
     * @param {string} id id секции
     * @returns {Expense}
     */
    setSectionId(id){
        if(typeof id === 'string' && id.length > 0) {
            this._modified.section_id = id
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает user_id
     * @get
     * @name Expense.user_id
     * @returns {string}
     */
    get user_id(){
        return this._modified.user_id
    }

    /**
     * метод устанавливает user_id
     * @method
     * @name Expense.setUserID
     * @param {string} id user id
     * @returns {Expense}
     */
    setUserID(id){
        if(typeof id === 'string' && id.length > 0) {
            this._modified.user_id = id
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает personal
     * @get
     * @name Expense.personal
     * @returns {DBFlagType}
     */
    get personal(){
        return this._modified.personal
    }

    /**
     * метод устанавливает personal
     * @method
     * @name Expense.setPersonal
     * @param {DBFlagType} flag is expense personal
     * @returns {Expense}
     */
    setPersonal(flag){
        if(typeof flag === 'number' && (flag === 1 || flag === 0)) {
            this._modified.personal = flag
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает title
     * @get
     * @name Expense.title
     * @returns {string}
     */
    get title(){
        return this._modified.title
    }

    /**
     * метод устанавливает title
     * @method
     * @name Expense.setTitle
     * @param {string} title expense title
     * @returns {Expense}
     */
    setTitle(title){
        if(typeof title === 'string' && title.length > 0) {
            this._modified.title = title
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает value
     * @get
     * @name Expense.value
     * @returns {number}
     */
    get value(){
        return this._modified.value
    }

    /**
     * метод устанавливает value
     * @method
     * @name Expense.setValue
     * @param {number} value  expense value
     * @returns {Expense}
     */
    setValue(value){
        if(typeof value === 'number' && value >= 0) {
            this._modified.value = value
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает primary_entity_id
     * @get
     * @name Expense.primary_entity_id
     * @returns {string}
     */
    get primary_entity_id(){
        return this._modified.primary_entity_id
    }

    /**
     * метод устанавливает primary_entity_id
     * @method
     * @name Expense.setPrimaryEntityID
     * @param {string} id  expense primary_entity_id
     * @returns {Expense}
     */
    setPrimaryEntityID(id){
        if(typeof id === 'string' && id.length > 0) {
            this._modified.primary_entity_id = id
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает entity_id
     * @get
     * @name Expense.entity_id
     * @returns {string}
     */
    get entity_id(){
        return this._modified.entity_id
    }

    /**
     * метод устанавливает entity_id
     * @method
     * @name Expense.setEntityID
     * @param {string} id  expense entity_id
     * @returns {Expense}
     */
    setEntityID(id){
        if(typeof id === 'string' && id.length > 0) {
            this._modified.entity_id = id
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает entity_type
     * @get
     * @name Expense.entity_type
     * @returns {string}
     */
    get entity_type(){
        return this._modified.entity_type
    }

    /**
     * метод устанавливает entity_type
     * @method
     * @name Expense.setEntityType
     * @param {string} type  expense entity_type
     * @returns {Expense}
     */
    setEntityType(type){
        if(typeof type === 'string' && type.length > 0) {
            this._modified.entity_type = type
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает primary_entity_type
     * @get
     * @name Expense.primary_entity_type
     * @returns {string}
     */
    get primary_entity_type(){
        return this._modified.primary_entity_type
    }

    /**
     * метод устанавливает primary_entity_type
     * @method
     * @name Expense.setPrimaryEntityType
     * @param {string} type  expense primary_entity_type
     * @returns {Expense}
     */
    setPrimaryEntityType(type){
        if(typeof type === 'string' && type.length > 0) {
            this._modified.primary_entity_type = type
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает created_at
     * @get
     * @name Expense.created_at
     * @returns {string}
     */
    get created_at(){
        return this._modified.created_at
    }

    /**
     * метод устанавливает created_at
     * @method
     * @name Expense.setCreatedAt
     * @param {string | Date} time время когда была созданна запись о расходе впервые
     * @returns {Expense}
     */
    setCreatedAt(time){
        if(time instanceof Date){
            this._modified.created_at = time.toISOString()
            this.change = true
        } else if(typeof  time === 'string'){
            const date = new Date(time)
            if(!Number.isNaN(date.getTime())){
                this._modified.created_at = date.toISOString()
                this.change = true
            }
        }
        return this
    }

    /**
     * геттер возвращает datetime
     * @get
     * @name Expense.datetime
     * @returns {string}
     */
    get datetime(){
        return this._modified.datetime
    }

    /**
     * метод устанавливает datetime
     * @method
     * @name Expense.setDatetime
     * @param {string | Date} time время когда была созданна запись о расходе впервые
     * @returns {Expense}
     */
    setDatetime(time){
        if(time instanceof Date){
            this._modified.datetime = time.toISOString()
            this.change = true
        } else if(typeof  time === 'string'){
            const date = new Date(time)
            if(!Number.isNaN(date.getTime())){
                this._modified.datetime = date.toISOString()
                this.change = true
            }
        }
        return this
    }

    /**
     * @get
     * @name Expense.changed
     * @returns {boolean}
     */
    get changed(){
        return this.change
    }

    /**
     * метод созраняет запись о расходан в бд
     * @method
     * @name Expense.save
     * @returns {Promise<Expense>}
     */
    async save(){
        if(this.change){
            let expenseService
            if(this.type === 'plan') {
                expenseService = expenses_plan_service
            } else if(this.type === 'actual'){
                expenseService = expenses_actual_service
            }
            if(expenseService){
            this.newExpense
                ? await expenseService.create(this._modified)
                : await expenseService.update(this._modified)
            }
        }
        return this
    }

    /**
     * метод удаляет запись о расходе из бд
     * @method
     * @name Expense.delete
     * @returns {Promise<Expense>}
     */
    async delete(){
        let expenseService
        if(this.type === 'plan') {
            expenseService = expenses_plan_service
        } else if(this.type === 'actual'){
            expenseService = expenses_actual_service
        }
        if(expenseService){
            await expenseService.delete(this._modified)
        }
        return this
    }

    toString(){
        return JSON.stringify(this._modified)
    }
}