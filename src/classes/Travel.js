import BaseTravel from "./BaseTravel";
import ErrorReport from "../controllers/ErrorReport";
import createId from "../utils/createId";
import BaseService from "./BaseService";
import constants from "../static/constants";
import storeDB from "../db/storeDB/storeDB";
import {pushAlertMessage} from "../components/Alerts/Alerts";
import Subscription from "./Subscription";
import Expense from "./Expense";
import {defaultFilterValue} from "../modules/Expenses/static/vars";
import Section from "./Section";


/**
 * класс для обработки логики приложения при редактировании путешествия
 * @class
 * @name Travel
 * @extends BaseTravel
 *
 *
 * @param {TravelType} item
 * @constructor
 */
export default class Travel extends BaseTravel {
    /**@type{{actual: BaseService, planned:BaseService}}*/
    expensesService

    /**@type{BaseService.<LimitType>}*/
    limitService

    /**@type{BaseService}*/
    sectionService

    /**@type{BaseService}*/
    hotelService

    /**@type{BaseService}*/
    appointmentService

    /**@type{SectionType[]}*/
    _defaultSections = []



    /**
     *
     * @type {{actual: {Personal: Map<string, Expense>, Common: Map<string, Expense>}, planned: {Personal: Map<string, Expense>, Common: Map<string, Expense>}}}
     * @private
     */
    _expenses = {
        actual: {
            Personal: new Map(),
            Common: new Map()
        },
        planned: {
            Personal: new Map(),
            Common: new Map()
        }
    }

    /**@type{Subscription<Travel>}*/
    _updateManager

    _forceUpdateTimerID = 0

    /**@type{ExpenseFilterType}*/
    _expenseFilter

    /**
     * @param {TravelType} item
     * @constructor
     */
    constructor(item) {
        super(item);
        this._errorHandle = this._errorHandle.bind(this)

        this._updateManager = new Subscription()

        storeDB
            .getAllFromIndex(constants.store.EXPENSES_ACTUAL, constants.indexes.PRIMARY_ENTITY_ID, this.id)
            .then(/** @param{ExpenseType[]} e*/e => e.map(ae => new Expense(this, ae, this.user_id, 'actual')))
            .then(ae => {
                ae.forEach(e => {
                    e.isPersonal()
                        ? this._expenses.actual.Personal.set(e.id, e)
                        : this._expenses.actual.Common.set(e.id, e)
                })
            })

        storeDB
            .getAllFromIndex(constants.store.EXPENSES_PLAN, constants.indexes.PRIMARY_ENTITY_ID, this.id)
            .then(/** @param{ExpenseType[]} e*/e => e.map(pe => new Expense(this, pe, this.user_id, 'plan')))
            .then(pe => {
                pe.forEach(e => {
                    e.isPersonal()
                        ? this._expenses.planned.Personal.set(e.id, e)
                        : this._expenses.planned.Common.set(e.id, e)
                })
            })


        this.expensesService = {
            actual: new BaseService(constants.store.EXPENSES_ACTUAL, {
                onCreate: this._onChangeExpense.bind(this, 'actual'),
                onUpdate: this._onChangeExpense.bind(this, 'actual'),
                onDelete: this._onChangeExpense.bind(this, 'actual'),
            }),
            planned: new BaseService(constants.store.EXPENSES_PLAN, {
                onCreate: this._onChangeExpense.bind(this, 'planned'),
                onUpdate: this._onChangeExpense.bind(this, 'planned'),
                onDelete: this._onChangeExpense.bind(this, 'planned')
            })
        }


        this.limitService = new BaseService(constants.store.LIMIT, {})
        this.sectionService = new BaseService(constants.store.SECTION, {})
        this.hotelService = new BaseService(constants.store.HOTELS, {})
        this.appointmentService = new BaseService(constants.store.APPOINTMENTS, {})


        this._expenseFilter = defaultFilterValue()
        Section.defaultSections()
            .then(sl => this._defaultSections = sl)
    }

    /**
     * получение типа фильтра расходов
     * @get
     * @name BaseTravel.expenseFilter
     * @returns {ExpenseFilterType}
     */
    get expenseFilter() {
        if(this.adults_count === 1) {
            return 'Personal'
        }

        return this._expenseFilter
    }

    /**
     * установка типа фильтра расходов
     * @method
     * @name BaseTravel.setExpenseFilter
     * @param {ExpenseFilterType} value
     * @returns {Travel}
     */
    setExpenseFilter(value) {
        if (typeof value === 'string' && value.length > 0) {
            this._expenseFilter = value
            this._update()
        }
        return this
    }

    /**
     * @get
     * @name BaseTravel.getDefaultSections
     * @returns {SectionType[]}
     */
    get defaultSections() {
        return this._defaultSections
    }

    /**
     * Статический метод преднозначен для создания нового экземпляра BaseTravel
     * @static
     * @name Travel.newTravel
     * @param {string} owner id автора путешествия
     * @param {TravelType} [options] параметры, которые будут использованны в качестве значений по умолчанию (если переданны)
     * @returns {Travel | null}
     */
    static newTravel(owner, options) {
        /**@type{Error} */
        let err
        if (typeof owner !== 'string') err = new Error('Owner should be defined')
        else if (options && typeof options !== 'object') err = new Error('Expect that param "options" typeof object')

        if (err) {
            console.error(err)
            ErrorReport.sendError(err).catch(console.error)
            return null
        }
        if (!options) options = {}

        /**@type{TravelType} */
        const temp = {id: createId()}
        Object
            .keys(options)
            .forEach(key => {
                if (key in BaseTravel.initValue) temp[key] = options[key]
                else console.warn(`Key "${key}" is not exist in type "TravelType" or not define in BaseTravel.initValue`)
            })
        temp.owner_id = owner

        const travel = new Travel(temp)
        travel
            .setNew(true)
            .setChange(true)
            .setUser(owner)

        return travel
    }

    /**
     * Метод отправляет сообщение об ошибке и записывает
     * @param {Error} err
     * @private
     */
    _errorHandle(err) {
        const {message, stack} = err
        const time = Date.now()
        const extra = ErrorReport.getExtraInfo()
        const error = {time, message, stack, ...extra}

        console.error(err)
        storeDB
            .addElement(constants.store.ERRORS, error)
            .then(() => {
                ErrorReport
                    .sendError(err)
                    .catch(console.error)
            })
            .finally(() => pushAlertMessage({type: "danger", message: 'Произошла неизвестная ошибка'}))

    }

    /**
     * @method
     * @name Travel._onChangeExpense
     * @param {'actual' | 'planned'} type
     * @param {ExpenseType} item
     * @private
     */
    _onChangeExpense(type, item) {
        if ((type === 'actual' || type === 'planned') && item && item.primary_entity_id) {
            const worker = new Worker(new URL('../workers/worker-expenses-total-update.js', import.meta.url))

            worker.onerror = this._errorHandle

            /**@param{MessageEvent<WorkerMessageType>} e */
            worker.onmessage = (e) => {
                if (e.data.type === 'done') {
                    if (type === 'planned') {
                        this._onChangeLimit()
                        worker.terminate()
                    } else {
                        this._update()
                        worker.terminate()
                    }
                } else if (e.data.type === 'error') {
                    this._errorHandle(e.data.payload)
                }
            }

            /**@type{WorkerMessageType}*/
            const message = type === "actual"
                ? {type: "update-expenses-actual", payload: {item, user_id: this.user_id}}
                : {type: "update-expenses-planned", payload: {item, user_id: this.user_id}}
            worker.postMessage(message)
        }
    }

    /**
     * метод пересчета лимитов
     * @method
     * @name Travel._onChangeLimit
     * @private
     */
    _onChangeLimit() {
        const worker = new Worker(new URL('../workers/worker-limits-update.js', import.meta.url))
        worker.onerror = this._errorHandle
        /**@param{MessageEvent<WorkerMessageType>} e */
        worker.onmessage = (e) => {
            if (e.data.type === 'done') {
                worker.terminate()
                this._update()
            } else if (e.data.type === 'error') {
                this._errorHandle(e.data.payload)
            }
        }

        /**@type{WorkerMessageType}*/
        const message = {type: "update-limit", payload: {primary_entity_id: this.id, user_id: this.user_id}}
        worker.postMessage(message)
    }

    /**
     * Статический метод для получения списка путешествий
     * @static
     * @name Travel.travelList
     * @returns {Promise<TravelType[]>}
     */
    static async travelList() {
        try {
            let list = await storeDB.getAll(constants.store.TRAVEL)
            list = list.map(l => new BaseTravel(l).object)
            return list
        } catch (err) {
            console.error(err)
            ErrorReport.sendError(err).catch(console.error)
            return []
        }
    }

    /**
     * метод устанавливает callback, который будет вызываться в случае необходимости перерисовать контент
     * @method
     * @name Travel.onUpdate
     * @param {(value: Travel) => unknown} cb callback, вызывается в сллучае необходимости перерисовать контент
     */
    onUpdate(cb) {
        this._updateManager.on(cb)
        return this
    }

    /**
     * метод обновляет приложение с задержой
     * @method
     * @name Travel.forceUpdate
     * @param {number} [delay] default = 300
     */
    forceUpdate(delay = 300) {
        if (this._forceUpdateTimerID) clearTimeout(this._forceUpdateTimerID)
        this._forceUpdateTimerID = setTimeout(() => {
            this._updateManager.dispatch(this)
            this._forceUpdateTimerID = undefined
        }, delay)
    }

    /**
     * метод удаляет callback, который будет вызываться в случае необходимости перерисовать контент
     * @method
     * @name Travel.offUpdate
     * @param {(value: Travel) => unknown} cb callback, вызывается в сллучае необходимости перерисовать контент
     */
    offUpdate(cb) {
        this._updateManager.off(cb)
        return this
    }

    /**
     * метод вызывает callback, переданый через метод setOnUpdateCallback
     * @method@name Travel._update
     * @private
     */
    _update() {
        this._updateManager.dispatch(this)
    }

    /**
     * @method
     * @name Travel.expenses
     * @param {'actual' | 'planned'} type
     * @param {ExpenseFilterType} [filter] по дефолту берется значение созраненное в localstorage или установленое с помощью метод setFilter
     * @returns {Expense[]}
     */
    expenses(type, filter) {
        const ft = filter || this.expenseFilter
        if (type === 'actual') {
            if (ft === 'Personal') return [...this._expenses.actual.Personal.values()]
            else if (ft === 'Common') return [...this._expenses.actual.Common.values()]
            else if (ft === 'All') return [...this._expenses.actual.Personal.values(), ...this._expenses.actual.Common.values()]
            else return []
        } else if (type === 'planned') {
            if (ft === 'Personal') return [...this._expenses.planned.Personal.values()]
            else if (ft === 'Common') return [...this._expenses.planned.Common.values()]
            else if (ft === 'All') return [...this._expenses.planned.Personal.values(), ...this._expenses.planned.Common.values()]
            else return []
        }
    }

    /**
     * @method
     * @name Travel.getExpense
     * @param {'actual' | 'planned'} type
     * @param {string} id
     * @returns {Expense | undefined}
     */
    getExpense(type, id) {
        if (type === 'actual') {
            return this._expenses.actual.Personal.get(id) || this._expenses.actual.Common.get(id)
        } else if (type === 'planned') {
            return this._expenses.planned.Personal.get(id) || this._expenses.planned.Common.get(id)
        }
    }

    /**
     * @method
     * @name Travel.addExpense
     * @param {Expense} expense
     * @param {'actual' | 'planned'} type
     * @returns {Travel}
     */
    addExpense(expense, type) {
        const personal = expense.isPersonal(this.user_id)

        if (expense && type) {
            this._expenses.actual.Personal.delete(expense.id)
            this._expenses.actual.Common.delete(expense.id)
            this._expenses.planned.Personal.delete(expense.id)
            this._expenses.planned.Common.delete(expense.id)

            if (type === 'actual') {
                personal
                    ? this._expenses.actual.Personal.set(expense.id, expense)
                    : this._expenses.actual.Common.set(expense.id, expense)
            } else if (type === 'planned') {
                personal
                    ? this._expenses.planned.Personal.set(expense.id, expense)
                    : this._expenses.planned.Common.set(expense.id, expense)
            }
        }

        this._onChangeExpense(type, expense.object)
        return this
    }

    /**
     * @method
     * @name Travel.removeExpense
     * @param {Expense} expense
     * @param {'actual' | 'planned'} type
     * @returns {Travel}
     */
    removeExpense(expense, type) {
        const personal = expense.isPersonal(this.user_id)
        if (expense && type) {
            if (type === 'actual') {
                personal
                    ? this._expenses.actual.Personal.delete(expense.id)
                    : this._expenses.actual.Common.delete(expense.id)
            } else if (type === 'planned') {
                personal
                    ? this._expenses.planned.Personal.delete(expense.id)
                    : this._expenses.planned.Common.delete(expense.id)
            }
        }

        this._update()
        return this
    }
}