/**
 * @typedef {ActivityOptionsType} PlaceActivityOptionsType
 * @property {PlaceType} place
 */
import Activity from "./Activity";
import dateToStringFormat from "../utils/dateToStringFormat";
import {MS_IN_DAY} from "../static/constants";
import RestTimeActivity from "./RestTimeActivity";

export default class PlaceActivity extends Activity {
    /**
     * @param {PlaceActivityOptionsType} options
     */
    constructor(options) {
        super(options)
        if (!options.place)
            throw new Error('PlaceActivity options prop should have "place" prop')

        this.status = Activity.PLACE
        this.place = options.place
        let duration
        if (this.place.time_start && this.place.time_end)
            duration = new Date(this.place.time_end) - new Date(this.place.time_start)
        this.duration = duration || options.defaultActivitySpentTime || 0
    }

    isPlace() {
        return true
    }

    toString() {
        const time = Math.round((this.end - this.start) / 1000)
        const sec = time % 60
        const min = (time - sec) / 60 % 60
        const hour = Math.floor((time - sec - min * 60) / (60 * 60))

        return `
        ==================
        День ${this.days}
        
        Осмотр местности 👀,
        Начало: ${dateToStringFormat(this.start.toISOString())}
        Закончится: ${dateToStringFormat(this.end.toISOString())}
        длительность: ${hour}:${min > 9 ? min : '0' + min}:${sec > 9 ? sec : '0' + sec}
        Координаты: ${this.place.coords[0] || ''}, ${this.place.coords[1] || ''} 
        
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
    _isStartAtDayTime() {
        const startAt = this.start.getHours() * 60 * 60 * 1000
        return startAt >= Activity.MORNING_TIME && startAt <= Activity.EVENING_TIME;
    }

    shiftTimeBy(ms) {
        super.shiftTimeBy(ms)
        if (this.prev && this.next) {
            if (!this._isStartAtDayTime()) {
                const d = Math.ceil(this.start.getTime() / MS_IN_DAY)
                this.start = new Date(d * MS_IN_DAY + Activity.MORNING_TIME)
                this.end = new Date(this.start.getTime() + this.duration)

                const restActivity = new RestTimeActivity({
                    prev: this.prev,
                    next: this,
                    prevActivity: this.prev,
                    defaultActivitySpentTime: 0,
                    travel_start_time: this.travel_start_time
                })
                this.prev.next = restActivity
                this.prev = restActivity
                // this.prev.prev.shiftTimeBy()
            } else if (this.prev && this.prev.end.getDay() !== this.start.getDay()) {
                const restActivity = new RestTimeActivity({
                    prev: this.prev,
                    next: this,
                    prevActivity: this.prev,
                    defaultActivitySpentTime: 0,
                    travel_start_time: this.travel_start_time
                })
                this.prev.next = restActivity
                this.prev = restActivity
            }
        }

        if (this.next) this.next.shiftTimeBy(ms)
    }


}