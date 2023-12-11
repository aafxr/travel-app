/**
 * @typedef {ActivityOptionsType} PlaceActivityOptionsType
 * @property {PlaceType} place
 * @property {Date} start
 */
import Activity from "./Activity";
import dateToStringFormat from "../utils/dateToStringFormat";
import {MS_IN_DAY} from "../static/constants";
import RestTimeActivity from "./RestTimeActivity";

export default class PlaceActivity extends Activity {
    /**@type{PlaceType}*/
    place

    /** @param {PlaceActivityOptionsType} options */
    constructor(options) {
        super(options)
        if (!options.place)
            throw new Error('PlaceActivity options prop should have "place" prop')

        this.place = options.place
        this.status = Activity.PLACE
        const placeStart = new Date(this.place.time_start)
        placeStart.setHours(Activity.MORNING_TIME / (60 * 60 * 1000))
        if (options.start)
            //если событие заплланированно позднее времени прибытия
            if (!Number.isNaN(placeStart.getTime()) && placeStart > options.start)
                this.start = placeStart
            else
                this.start = new Date(options.start)
        if (options.defaultActivitySpentTime)
            this.duration = options.preference.defaultSpentTime

        this._init()
    }

    _init() {
        if (this.place.time_start && this.place.time_end && false)
            this.duration = new Date(this.place.time_end) - new Date(this.place.time_start)
        else
            this.duration = this.defaultDuration

        if (!this.start)
            this.start = new Date(this.place.time_start || this.travel_start_time)

        this.end = new Date(this.start.getTime() + this.duration)
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
}