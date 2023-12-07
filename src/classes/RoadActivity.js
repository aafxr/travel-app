/**
 * @typedef {ActivityOptionsType} RoadActivityOptionsType
 * @property {PlaceType} from
 * @property {PlaceType} to
 */
import Activity from "./Activity";
import getDistanceFromTwoPoints from "../utils/getDistanceFromTwoPoints";
import dateToStringFormat from "../utils/dateToStringFormat";
import {MS_IN_DAY} from "../static/constants";

export default class RoadActivity extends Activity {
    static WALK_SPEED = 5 * 1000 / 3600
    static CAR_SPEED = 50 * 1000 / 3600
    static PUBLIC_TRANSPORT__SPEED = 25 * 1000 / 3600
    static PLANE_SPEED = 900 * 1000 / 3600

    /** @type{PlaceType}*/
    from
    /** @type{PlaceType}*/
    to

    /**@type {{start: Date, end: Date}[]}*/
    restTimeList = []

    /** @param {RoadActivityOptionsType} options */
    constructor(options) {
        super(options)
        if (!options.from || !options.to)
            throw  new Error('RoadActivity options prop should contain "from" & "to" props')

        this.from = options.from
        this.to = options.to

        this.distance = getDistanceFromTwoPoints(options.from.place.coords, options.to.place.coords) * 1000 // м/с

        if (this.distance < 5_000) {
            this.status = Activity.WALK
            this.speed = RoadActivity.WALK_SPEED
        } else if (this.distance < 50_000) {
            this.status = Activity.PUBLIC_TRANSPORT
            this.speed = RoadActivity.PUBLIC_TRANSPORT__SPEED
        } else if (this.distance > 50_000) {
            this.status = Activity.CAR
            this.speed = RoadActivity.CAR_SPEED
        }
    }

    _init() {
        this.start = new Date(this.from.time_end || this.travel_start_time)
        this.duration = (this.distance / this.speed) * 1000
        this.end = new Date(this.start.getTime() + this.duration)
        if (!this.moveAtNight && this.isStartAtNight()) this.shiftTimeToNextDay()
        this._calcDuration()
    }

    _calcDuration() {
        if (this.moveAtNight) {
            this.duration = (this.distance / this.speed) * 1000
            this.end = new Date(this.start.getTime() + this.duration)
        } else {
            const parseTime = /**@param {Date} time */(time) => time.toLocaleTimeString().split(':')
            let timeLeft_ms = (this.distance / this.speed) * 1000

            const velocity = this.speed / 1000   // м/мс

            const drivingTime = Activity.EVENING_TIME - Activity.MORNING_TIME

            let currentTime = new Date(this.start)

            while (timeLeft_ms > 0) {
                currentTime.getTime()

            }
        }
    }

    isRoad() {
        return true
    }

    toString() {
        let emoji
        if (this.speed === RoadActivity.WALK_SPEED)
            emoji = '🚶🏻‍♂️'
        else if (this.speed === RoadActivity.CAR_SPEED)
            emoji = '🚗💨'
        else if (this.speed === RoadActivity.PUBLIC_TRANSPORT__SPEED)
            emoji = '🚌💨'

        return `
        ==================
        День ${this.days}
        
        В пути ${emoji}
        Начало: ${dateToStringFormat(this.start.toISOString())}
        Заккончится: ${dateToStringFormat(this.end.toISOString())}
        Дистанция: ${Math.round(this.distance)} м
        Сккорость: ${this.speed.toFixed(2)} м/с
        Время в пути: ${this.toTimeStingFormat()}
        
        ==================
        `
    }


}


/**
 *
 * @param {Date} start
 * @param {number} morning
 * @param {number} evening
 * @param {number} speed
 * @param {number} distance
 * @return {Date}
 */
export function calcArrivingTime(start, morning, evening, speed, distance) {
    let tempDistance = distance
    const finalTime = new Date(start)
    const velocity_ms = speed / 1000
    const evening_ms = evening * 60 * 60 * 1000
    const morning_ms = morning * 60 * 60 * 1000
    const night_ms = MS_IN_DAY - evening_ms + morning_ms

    const timeZoneOffset = start.getTimezoneOffset() * 60 * 1000

    let start_ms = Math.abs((finalTime.getTime()- timeZoneOffset) % MS_IN_DAY)
    if(start_ms >= evening_ms)
        incriseTime(finalTime, MS_IN_DAY - start_ms + morning_ms)

    let count = 0
    while (tempDistance > 0) {
        count += 1
        start_ms = Math.abs((finalTime.getTime()- timeZoneOffset) % MS_IN_DAY)
        let s = (evening_ms - start_ms) * velocity_ms

        if (s >= tempDistance) {
            const dt = tempDistance / velocity_ms
            incriseTime(finalTime, dt)
            return finalTime
        }

        tempDistance -= s
        if (count === 1)
            incriseTime(finalTime, MS_IN_DAY - start_ms + morning_ms)
        else
            incriseTime(finalTime, MS_IN_DAY - evening_ms + morning_ms)
    }
        console.log('count ', count)
    return finalTime
}

/**
 * @param {Date} time
 * @param {number} ms
 * @returns {Date}
 */
function incriseTime(time, ms = 0) {
    time.setTime(time.getTime() + ms)
    return time
}