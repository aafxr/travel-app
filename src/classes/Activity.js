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

    duration = 0
    distance = 0


    /**  @type{Date} */
    start
    /** @type{Date} */
    end

    /**@type{PlaceType}*/
    place
    /**@type{Activity}*/
    next = null
    /**@type{Activity}*/
    prev
    /**@type{number}*/
    status
    /**@type{number}*/
    _day


    /**  @param {ActivityOptionsType} options */
    constructor(options) {
        this.travel_start_time = options.travel_start_time

        if (!options.prevActivity) {
            this.prev = null
            this.start = new Date(this.travel_start_time.getTime())
        } else {
            this.prev = options.prevActivity
            this.start = new Date(this.prev.end.getTime())
        }
        this.end = new Date(this.start.getTime() + options.defaultActivitySpentTime)
        this._init()
    }

    /**
     * @abstract
     */
    _init() {

    }

    get days() {
        let time_start = (this.start - this.travel_start_time) / MS_IN_DAY
        time_start = Math.floor(time_start) + 1
        let time_end = (this.end - this.travel_start_time) / MS_IN_DAY
        time_end = Math.floor(time_end) + 1

        return range(time_start, time_end)
    }

    /**
     * @return {boolean}
     */
    isPlace() {
        return false
    }

    /**
     * @return {boolean}
     */
    isGoingToNextActivity() {
        return false
    }

    /**
     * @return {boolean}
     */
    isRest() {
        return false
    }

    /**
     * @abstract
     * @param {number} ms
     */
    shiftTimeBy(ms = 0) {
        if (!this.prev)
            this.start.setTime(this.start.getTime() + ms)
        else
            this.start.setTime(this.startAt)

        this.end = new Date(this.start.getTime() + this.duration)
    }

    /**
     * @param {Activity} activity
     */
    setPrev(activity) {
        if (!activity) return

        if (this.prev) {
            let temp = this.prev
            temp.next = activity
            activity.prev = temp
            activity.next = this
            this.prev = activity
        } else {
            activity.prev = null
            activity.next = this
            this.prev = activity
        }
        activity.shiftTimeBy()
    }

    /**
     * @param {Activity} activity
     */
    setNext(activity) {
        if (!activity) return

        if (this.next) {
            const temp = this.next
            this.next = activity
            activity.prev = this
            activity.next = temp
            temp.prev = activity
        } else {
            this.next = activity
            activity.prev = this
        }
        this.shiftTimeBy()
    }

    /**
     * @get
     * @returns {number}
     */
    get startAt() {
        if (this.prev)
            return this.prev.end.getTime()
        else
            return this.start.getTime()
    }

    /**
     * @param {number} activityStartTime время начала активности
     * @return{boolean}
     */
    _isInTimeRange(activityStartTime) {
        const time = activityStartTime % MS_IN_DAY

        return time > Activity.MORNING_TIME && time < Activity.EVNING_TIME
    }

    log() {
        console.log(this.toString())
        if (this.next)
            this.next.log()
    }

    /**
     * @param {Activity} activity
     */
    append(activity) {
        if (!activity) return

        if (this.next) this.next.append(activity)
        else {
            this.next = activity
            activity.prev = this
            activity.shiftTimeBy()
        }
    }

    /**
     * @param {[]} [array]
     * @return {Activity[]}
     */
    toArray(array = []) {
        array.push(this)
        if (this.next) this.next.toArray(array)
        return array
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
        if (this.next) return this.next.getDaysList(days)
        else return days
    }

    /**
     * @param {number} day
     * @param {Activity[]} [activities]
     * @returns {Activity[]}
     */
    getActivitiesAtDay(day, activities = []) {
        if (this.days.includes(day)) activities.push(this)
        if (this.next) return this.next.getActivitiesAtDay(day, activities)
        else return activities
    }

    /**
     * возвращает список уникальных дней
     * @returns {number[]}
     */
    getUniqDaysList() {
        return [...new Set(this.getDaysList())]
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

}