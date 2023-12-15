/**
 * @typedef {ActivityOptionsType} PlaceActivityOptionsType
 * @property {PlaceType} place
 * @property {Date} start
 */
import Activity from "./Activity";
import dateToStringFormat from "../utils/dateToStringFormat";
import {MS_IN_DAY} from "../static/constants";
import RestTimeActivity from "./RestTimeActivity";
import TimeHelper from "./TimeHelper";

export default class PlaceActivity extends Activity {
    /**@type{PlaceType}*/
    place

    /** @param {PlaceActivityOptionsType} options */
    constructor(options) {
        super(options)
        if (!options.place)
            throw new Error('PlaceActivity options prop should have "place" prop')
        if (!options.preference?.defaultSpentTime)
            throw new Error('PlaceActivity options prop should have ".preference.defaultSpentTime" prop')


        this.status = Activity.PLACE
        this.place = options.place
        if (this.place.time_start)
            this.start = new Date(this.place.time_start)
        if(this.place.time_end && this.place.time_start !== this.place.time_end)
            this.end = new Date(this.place.time_end)

        if(!this.start) {
            this.start = new Date(this.travel_start_time)
            this.start.setHours(Activity.MORNING_TIME / (60 * 60 * 1000))
        }

        if (!this.end || this.end < this.start){
            this.end = new Date(this.start + options.preference.defaultSpentTime)
        }


        if (options.start > this.start) {
            const delta = options.start - this.start
            new TimeHelper(Activity.MORNING_TIME, Activity.EVENING_TIME)
                .shiftAll([this.start, this.end], delta)

        }

        this.duration = this.end - this.start
        this._init()
    }

    _init() {
        this._setPlaceTime()
    }

    _setPlaceTime(){
        this.place.time_start = this.start.toISOString()
        this.place.time_end = this.end.toISOString()
    }

    isPlace() {
        return true
    }

    toString() {
        const {hh, mm, ss} = this.getDuration()

        return `
        ==================
        День ${this.days}

        id: ${this.place._id}
        Осмотр местности 👀,
        Начало: ${dateToStringFormat(this.start.toISOString())}
        Закончится: ${dateToStringFormat(this.end.toISOString())}
        длительность:  ${hh}:${mm > 9 ? mm : '0' + mm}:${ss > 9 ? ss : '0' + ss}
        Координаты: ${this.place.coords[0] || ''}, ${this.place.coords[1] || ''}

        ==================
        `
    }

    setStart(time) {
        super.setStart(time);
        this._setPlaceTime()
        return this
    }

    setEnd(time) {
        super.setEnd(time);
        this._setPlaceTime()
        return this
    }
}