/**
 * @typedef {ActivityOptionsType} PlaceActivityOptionsType
 * @property {PlaceType} place
 */
import Activity from "./Activity";
import dateToStringFormat from "../utils/dateToStringFormat";
import {MS_IN_DAY} from "../static/constants";

export default class PlaceActivity extends Activity{
    /**
     * @param {PlaceActivityOptionsType} options
     */
    constructor(options) {
        super(options)
        if(!options.place)
            throw new Error('PlaceActivity options prop should have "place" prop')

        this.status = Activity.PLACE
        this.place = options.place
        let duration
        if(this.place.time_start && this.place.time_end)
            duration = new Date(this.place.time_end) - new Date(this.place.time_start)
        this.duration = duration || options.defaultActivitySpentTime || 0
    }

    isPlace() {
        return true
    }

    toString() {
        return `
        ==================
        
        Осмотр местности 👁👁,
        Начало: ${dateToStringFormat(this.start.toISOString())}
        Закончится: ${dateToStringFormat(this.end.toISOString())}
        Координаты: ${this.place.coords[0]}, ${this.place.coords[1]} 
        
        ==================
        `
    }

    _init() {
        super._init()
    }

    /**
     * @returns {boolean}
     * @private
     */
    _isStartAtDayTime(){
        const startAt = this.start.getTime() % MS_IN_DAY
        return startAt > Activity.MORNING_TIME || startAt < Activity.EVENING_TIME;
    }

    shiftTimeBy(ms) {
        super.shiftTimeBy(ms)
        if(!this._isStartAtDayTime()){
            const d = Math.ceil(this.start.getTime() / MS_IN_DAY)
            this.start = new Date(d * MS_IN_DAY + Activity.MORNING_TIME)
            this.end = new Date(this.start.getTime() + this.duration)
            this.next.shiftTimeBy(ms)
            return
        }

        if (this.next) this.next.shiftTimeBy(ms)
    }
}