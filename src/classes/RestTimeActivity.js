import Activity from "./Activity";
import dateToStringFormat from "../utils/dateToStringFormat";
import {MS_IN_DAY} from "../static/constants";

/**
 * @typedef {ActivityOptionsType} RestTimeActivityOptionsTime
 * @property {Activity} prev
 * @property {Activity} next
 */

export default class RestTimeActivity extends Activity {
    /**
     * @param {RestTimeActivityOptionsTime} options
     */
    constructor(options) {
        super(options)
        this.status = Activity.REST_TIME
        this.prev = options.prev
        this.next = options.next
        this.deltaHourse = this.end.getTimezoneOffset() / 60
        this.delta_ms = this.deltaHourse * 1000 * 60 * 60
        this.start = new Date(this.prev.end.getTime())

        const d = Math.floor(this.next.start.getTime() / MS_IN_DAY)
        // const dayTime = this._getLocalDayTimeMS()
        // const end = dayTime < Activity.MORNING_TIME
        //     ? Activity.MORNING_TIME + this.delta_ms
        //     : dayTime + this.delta_ms
        // const delta =
        // const end =
        this.end = new Date(this.next.start.getTime())
    }

    _init() {
        super._init()
    }

    /**
     * возвращаеь локальное время в миллисекундах __(мс)__
     * @returns {number}
     * @private
     */
    _getLocalDayTimeMS() {
        const localHour = this.next.start.getHours() + this.deltaHourse
        return localHour / 24 * MS_IN_DAY
    }

    shiftTimeBy(ms) {
        if (!this.next) this.prev.next = null
        if (this.prev instanceof RestTimeActivity) {
            this.start = this.prev.start
            this.prev = this.prev.prev
            return
        }

        const newStartTime = new Date(this.startAt)
        if (newStartTime.getHours() * 60 * 60 * 1000 >= Activity.MORNING_TIME) {
            this.prev.next = this.next
            this.next?.shiftTimeBy(ms)
            return
        } else
            this.start = newStartTime

        if (this.next) this.next.shiftTimeBy(ms)
    }

    toString() {
        const time = Math.round((this.end - this.start) / 1000)
        const sec = time % 60
        const min = (time - sec) / 60 % 60
        const hour = Math.floor((time - sec - min * 60) / (60 * 60))

        return `
        ==================
        
          ____  ____   ___   ___
         /___  /___/  /__   /__
        /     /  \\   /__   /__
        
        Начало: ${dateToStringFormat(this.start.toISOString())}
        Закончится: ${dateToStringFormat(this.end.toISOString())}
        длительность: ${hour}:${min > 9 ? min : '0' + min}:${sec > 9 ? sec : '0' + sec}
        
        ==================
        `
    }

    getDaysList(days = []) {
        return this.next.getDaysList(days)
    }

    getActivitiesAtDay(day, activities = []) {
        return this.next.getActivitiesAtDay(day, activities)
    }

    isRest() {
        return true
    }
}