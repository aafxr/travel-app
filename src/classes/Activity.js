/**
 * @typedef PreferenceType
 * @property {number} defaultSpentTime время в мс на активность по умочанию
 * @property {boolean} moveAtNight
 */

/**
 * @typedef ActivityOptionsType
 * @property {Date} travel_start_time
 * @property {PreferenceType} preference
 * @property {number} defaultActivitySpentTime время в мс на активность по умочанию
 */
import {MS_IN_DAY} from "../static/constants";
import range from "../utils/range";
import TimeHelper from "./TimeHelper";

export default class Activity {
    static EVENING_TIME = 21 * 60 * 60 * 1000
    static MORNING_TIME = 9 * 60 * 60 * 1000

    static WALK = 100
    static CAR = 101
    static PUBLIC_TRANSPORT = 102
    static PLANE = 103

    static PLACE = 200
    static HOTEL = 201
    static APPOINTMENT = 202
    static REGION = 204
    static AIRPORT = 205

    static REST_TIME = 300

    /**  @type{Date} */
    travel_start_time
    /**  @type{Date} */
    start
    /** @type{Date} */
    end

    defaultDuration = 1000 * 60 * 45
    moveAtNight = false
    duration = 0

    status = -1

    /**@type{number}*/
    _day


    /**  @param {ActivityOptionsType} options */
    constructor(options) {
        if (new.target === Activity)
            throw new Error('Activity is abstract class')

        this.travel_start_time = new Date(options.travel_start_time)

        if((this.travel_start_time.getTime() + this.travel_start_time.getTimezoneOffset()* 60 * 1000) % MS_IN_DAY)
            this.travel_start_time.setTime(this.travel_start_time.getTime() - this.travel_start_time.getTime() % MS_IN_DAY + this.travel_start_time.getTimezoneOffset() * 60 * 1000)

        if (!options.preference) options.preference = {}
        const preferences = options.preference

        if (preferences.defaultSpentTime) this.defaultDuration = preferences.defaultSpentTime
        if (typeof preferences.moveAtNight === 'boolean') this.moveAtNight = preferences.moveAtNight

        this.timezoneOffset = this.travel_start_time.getTimezoneOffset() * 60 * 1000
    }

    /**
     * возвращает массив дней в которые данная активность происходит
     * @get
     * @name Activity.days
     * @return {number[]}
     */
    get days() {
        return range(this.startDay, this.endDay)
    }

    /**
     * возвращает день начала активности
     * @get
     * @name Activity.startDay
     * @return {number}
     */
    get startDay() {
        const activityStartDay = (this.start - this.travel_start_time) / MS_IN_DAY
        return Math.floor(activityStartDay) + 1
    }

    /**
     * возвращает день окончания активности
     * @get
     * @name Activity.endDay
     * @return {number}
     */
    get endDay() {
        const activityEndDay = (this.end - this.travel_start_time) / MS_IN_DAY
        return Math.floor(activityEndDay) + 1
    }

    /** @return {boolean} */
    isPlace() {
        return false
    }

    /** @return {boolean} */
    isRoad() {
        return false
    }

    /** @return {boolean} */
    isRest() {
        return false
    }

    /**
     * @method
     * @name Activity.shiftTimeBy
     * @param {number} ms
     */
    shiftTimeBy(ms = 0) {
        this.start = new Date(this.start.getTime() + ms)
        this.end = new Date(this.start.getTime() + this.duration)
    }

    shiftTimeToNextDay() {
        this.start = new Date(this.start.getTime() + MS_IN_DAY)
        this.start.setHours(9)
        this.end = new Date(this.start.getTime() + this.duration)
    }

    /**
     * @get
     * @returns {number}
     */
    get startAt() {
        return this.start?.getTime() ?? 0
    }

    /**
     * время в интервале между 9:00 - 18:00
     * @param {Date} time время начала активности
     * @return{boolean}
     */
    isAtDayTime(time) {
        return new TimeHelper(Activity.MORNING_TIME, Activity.EVENING_TIME).isAtDayTime(time)
    }

    /** @returns {boolean} */
    isStartAtNight() {
        return !this.isAtDayTime(this.start)
    }

    /** @returns {boolean} */
    isEndAtNight() {
        return !this.isAtDayTime(this.end)
    }

    /** @returns {boolean} */
    isStartAtMorning() {
        return (this.start - this.timezoneOffset) % MS_IN_DAY === Activity.MORNING_TIME
    }

    toString() {
        return 'abstract activity'
    }

    /**
     * @param {number[]} [days]
     * @returns {number[]}
     */
    getDaysList(days = []) {
        days.push(...this.days)
        return days
    }

    /**
     *
     * @returns {string}
     */
    durationToSting() {
        const time = Math.round(this.duration / 1000)
        const sec = time % 60
        const min = (time - sec) / 60 % 60
        const hour = Math.floor((time - sec - min * 60) / (60 * 60))

        return `${hour > 9 ? hour : ('0' + hour)}:${min > 9 ? min : ('0' + min)}:${sec > 9 ? sec : ('0' + sec)}`
    }


    /**
     * время начало активности
     * @method
     * @name Activity.setStart
     * @param {string | Date} time
     * @return {Activity}
     */
    setStart(time) {
        const date = new Date(time)
        if (!Number.isNaN(date.getTime())) {
            this.start = date
            this.duration = this.end - this.start
        }
        return this
    }

    /**
     * время завершения активности
     * @method
     * @name Activity.setEnd
     * @param {string | Date} time
     * @return {Activity}
     */
    setEnd(time) {
        const date = new Date(time)
        if (!Number.isNaN(date.getTime()) && date > this.start) {
            this.end = date
            this.duration = this.end - this.start
        }
        return this
    }

    /**
     * установка длительности активности
     * @param {number} time время в __миллисекундач (мс)__
     * @return {Activity}
     */
    setDuration(time = 0) {
        this.duration = time
        this.end = new Date(this.start.getTime() + time)
        return this
    }

    getDuration() {
        const time = Math.round(this.duration / 1000)
        const ss = time % 60
        const mm = (time - ss) / 60 % 60
        const hh = Math.floor((time - ss - mm * 60) / (60 * 60))

        return {hh, mm, ss}
    }

    /**
     * возвращает свободное время
     * @method
     * @name Activity.getRestTime
     * @returns {{start: Date, end: Date}[]}
     */
    getRestTime() {
        return []
    }

    hasRestTime() {
        return false
    }

}

