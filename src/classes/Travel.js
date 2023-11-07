import BaseTravel from "./BaseTravel";
import ErrorReport from "../controllers/ErrorReport";
import createId from "../utils/createId";
import BaseService from "./BaseService";
import constants from "../static/constants";
import storeDB from "../db/storeDB/storeDB";
import {pushAlertMessage} from "../components/Alerts/Alerts";
import Subscription from "./Subscription";
import Expense from "./Expense";

// Продумать структуру менеджера для работы с сущностями отели, встречи, расходы и тд
// реалирзовать абстракцию менеджера
// добавить описание абстракции
// Реализовать получение "курсора" для работы с большим объемом данных в бд
// Добавить описание методов для работы с "курсором"

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

    /**
     *
     * @type {{actual: {All: [], Personal: [], Common: []}, planned: {All: [], Personal: [], Common: []}}}
     * @private
     */
    _expenses = {
        actual: {
            All: [],
            Personal: [],
            Common: []
        },
        planned: {
            All: [],
            Personal: [],
            Common: []
        }
    }

    /**@type{Subscription<Travel>}*/
    _updateManager

    _forceUpdateTimerID = 0

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
                        ? this._expenses.actual.Personal.push(e)
                        : this._expenses.actual.Common.push(e)
                    this._expenses.actual.All.push(e)
                })
            })

        storeDB
            .getAllFromIndex(constants.store.EXPENSES_PLAN, constants.indexes.PRIMARY_ENTITY_ID, this.id)
            .then(/** @param{ExpenseType[]} e*/e => e.map(pe => new Expense(this, pe, this.user_id, 'plan')))
            .then(pe =>{
                pe.forEach(e => {
                    e.isPersonal()
                        ? this._expenses.planned.Personal.push(e)
                        : this._expenses.planned.Common.push(e)
                    this._expenses.planned.All.push(e)
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
                // debugger
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
     * @name Travel.expensesActualPersonal
     * @returns {Expense[]}
     */
    get expensesActualPersonal() {
        return this._expenses.actual.Personal
    }
    /**
     * @method
     * @name Travel.expensesActualCommon
     * @returns {Expense[]}
     */
    get expensesActualCommon() {
        return this._expenses.actual.Common
    }
    /**
     * @method
     * @name Travel.expensesActualAll
     * @returns {Expense[]}
     */
    get expensesActualAll() {
        return this._expenses.actual.All
    }

    /**
     * @method
     * @name Travel.expensesPlannedPersonal
     * @returns {Expense[]}
     */
    get expensesPlannedPersonal() {
        return this._expenses.planned.Personal
    }
    /**
     * @method
     * @name Travel.expensesPlannedCommon
     * @returns {Expense[]}
     */
    get expensesPlannedCommon() {
        return this._expenses.planned.Common
    }
    /**
     * @method
     * @name Travel.expensesPlannedAll
     * @returns {Expense[]}
     */
    get expensesPlannedAll() {
        return this._expenses.planned.All
    }

    /**
     * @method
     * @name Travel.expenses
     * @param {'actual' | 'planned'} type
     * @param {ExpenseFilterType} filter
     * @returns {Expense[]}
     */
    expenses(type, filter){
        if(type === 'actual'){
            return this._expenses.actual[filter]
        } else if (type === 'planned'){
            return this._expenses.planned[filter]
        }
    }


}