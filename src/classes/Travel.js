import BaseTravel from "./BaseTravel";
import ErrorReport from "../controllers/ErrorReport";
import createId from "../utils/createId";
import BaseService from "./BaseService";
import constants from "../static/constants";
import storeDB from "../db/storeDB/storeDB";
import {pushAlertMessage} from "../components/Alerts/Alerts";
import Subscription from "./Subscription";

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
    expenses

    /**@type{BaseService.<LimitType>}*/
    limit

    /**@type{BaseService}*/
    section

    /**@type{BaseService}*/
    hotel

    /**@type{BaseService}*/
    appointment

    /**@type{Subscription<Travel>}*/
    _updateManager

    /**
     * @param {TravelType} item
     * @constructor
     */
    constructor(item) {
        super(item);
        this._errorHandle = this._errorHandle.bind(this)

        this._updateManager = new Subscription()

        this.expenses = {
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

        this.limit = new BaseService(constants.store.LIMIT, {})
        this.section = new BaseService(constants.store.SECTION, {})
        this.hotel = new BaseService(constants.store.HOTELS, {})
        this.appointment = new BaseService(constants.store.APPOINTMENTS, {})
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
                    console.log(e.data)
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
                console.log(e.data)
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

}