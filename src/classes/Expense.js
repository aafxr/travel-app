import {isThisYear} from "date-fns";
import createId from "../utils/createId";

export default class Expense {
    /**
     * @param {ExpenseType} item
     * @param {string} user_id
     * @constructor
     */
    constructor(item, user_id) {
        if (!item) item = {}

        /***@type{ExpenseType}*/
        this._initValue = item
        /***@type{ExpenseType}*/
        this._modified = {
            id: this._initValue.id || createId(user_id || ''),
            section_id: this._initValue.section_id || '',
            user_id: this._initValue.user_id || user_id || '',
            personal: this._initValue.personal || 0,
            title: this._initValue.title || '',
            value: this._initValue.value || 0,
            primary_entity_id: this._initValue.primary_entity_id || '',
            created_at: this._initValue.created_at || new Date().toISOString(),
            datetime: this._initValue.datetime || new Date().toISOString(),
            entity_id: this._initValue.entity_id || '',
            entity_type: this._initValue.entity_type || '',
            primary_entity_type: this._initValue.primary_entity_type || ''
        }

        this.change = false
    }

    /**
     * геттер возвращает id расхода
     * @get
     * @methor
     * @name Expense.id
     * @returns {string}
     */
    get id(){
        return this._modified.id
    }

    /**
     * геттер возвращает section_id
     * @get
     * @method
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
     * @method
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
     * @method
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
     * @method
     * @name Expense.title
     * @returns {string}
     */
    get title(){
        return this._modified.title
    }

    /**
     * метод устанавливает title
     * @method
     * @name Expense.setUserID
     * @param {string} title expense title
     * @returns {Expense}
     */
    setTitle(title){
        if(typeof title === 'string' && title.length > 0) {
            this._modified.user_id = title
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает value
     * @get
     * @method
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
        if(typeof value === 'number' && (value >= 0)) {
            this._modified.personal = value
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает primary_entity_id
     * @get
     * @method
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
     * @method
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
     * @method
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
     * @method
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






    // created_at
    // datetime
}