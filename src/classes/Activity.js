/**
 * @typedef ActivityOptionsType
 * @property {Date} travel_start_time
 * @property {number} [start_place_index]
 * @property {Activity} [prevActivity]
 * @property {number} defaultActivitySpentTime время в мс на активность по умочанию
 */
import {MS_IN_DAY} from "../static/constants";
import range from "../utils/range";

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

    duration = 0

    status = -1

    /**@type{number}*/
    _day


    /**  @param {ActivityOptionsType} options */
    constructor(options) {
        this.travel_start_time = options.travel_start_time

        if (new.target === Activity)
            throw new Error('Activity is abstract class')
    }

    /**
     * @abstract
     */
    _init() {
    }

    /**
     * возвращает массив дней в которые данная активность происходит
     * @get
     * @name Activity.days
     * @return {number[]}
     */
    get days() {
        let time_start = (this.start - this.travel_start_time) / MS_IN_DAY
        time_start = Math.floor(time_start) + 1
        let time_end = (this.end - this.travel_start_time) / MS_IN_DAY
        time_end = Math.floor(time_end) + 1

        return range(time_start, time_end)
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
     * @abstract
     * @param {number} ms
     */
    shiftTimeBy(ms = 0) {
        this.start = new Date(this.start.getTime() + ms)
        this.end = new Date(this.start.getTime() + this.duration)
    }

    /**
     * @get
     * @returns {number}
     */
    get startAt() {
        if (this.prev)
            return this.prev.end?.getTime() ?? 0
        else
            return this.start?.getTime() ?? 0
    }

    /**
     * @param {number} activityStartTime время начала активности
     * @return{boolean}
     */
    _isInTimeRange(activityStartTime) {
        const time = activityStartTime % MS_IN_DAY

        return time > Activity.MORNING_TIME && time < Activity.EVNING_TIME
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
    toTimeStingFormat() {
        const time = Math.round((this.end - this.start) / 1000)
        const sec = time % 60
        const min = (time - sec) / 60 % 60
        const hour = Math.floor((time - sec - min * 60) / (60 * 60))

        return `${hour}:${min > 9 ? min : '0' + min}:${sec > 9 ? sec : '0' + sec}`
    }

    /**
     * @returns {boolean}
     */
    isEndAtNight() {
        const [hh, mm, ss] = this.end.toLocaleTimeString().split(':').map(el => +el)
        const time_ms = hh * 60 * 60 * 1000 + mm * 60 * 1000 + ss * 1000
        return (time_ms > Activity.EVENING_TIME || time_ms < Activity.MORNING_TIME);
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

}

