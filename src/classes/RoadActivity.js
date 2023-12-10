/**
 * @typedef {ActivityOptionsType} RoadActivityOptionsType
 * @property {PlaceType} from
 * @property {PlaceType} to
 * @property {Date} start
 * @property {Date} end
 * @property {number} distance
 * @property {number} status
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

        this.start = options.start ? new Date(options.start) : null
        this.end = options.end ? new Date(options.end) : null
        this.duration = this.end - this.start

        if (options.distance)
            this.distance = options.distance
        else if (this.from && this.end)
            this.distance = getDistanceFromTwoPoints(options.from.place.coords, options.to.place.coords) * 1000 // м/с
        else console.warn('Необходимо указать "from" & "to"  либо "distance" в опциях RoadActivity')

        if (options.status) {
            this.status = options.status
            switch (this.status) {
                case Activity.WALK:
                    this.speed = RoadActivity.WALK_SPEED
                    break
                case Activity.PUBLIC_TRANSPORT:
                    this.speed = RoadActivity.PUBLIC_TRANSPCAR__SPEED
                    break
                case Activity.CAR:
                    this.speed = RoadActivity.CAR__SPEED
                    break
                default:
                    this.speed = RoadActivity.CAR__SPEED
            }

        } else if (this.distance < 5_000) {
            this.status = Activity.WALK
            this.speed = RoadActivity.WALK_SPEED
        } else if (this.distance < 50_000) {
            this.status = Activity.PUBLIC_TRANSPORT
            this.speed = RoadActivity.PUBLIC_TRANSPORT__SPEED
        } else if (this.distance > 50_000) {
            this.status = Activity.CAR
            this.speed = RoadActivity.CAR_SPEED
        } else {
            console.warn('RoadActivity')
        }
    }

    // _init() {
    //     this.start = new Date(this.from.time_end || this.travel_start_time)
    //     this.duration = (this.distance / this.speed) * 1000
    //     this.end = new Date(this.start.getTime() + this.duration)
    //     if (!this.moveAtNight && this.isStartAtNight()) this.shiftTimeToNextDay()
    //     // this._calcDuration()
    // }

    // _calcDuration() {
    //     if (this.moveAtNight) {
    //         this.duration = (this.distance / this.speed) * 1000
    //         this.end = new Date(this.start.getTime() + this.duration)
    //     } else {
    //         const parseTime = /**@param {Date} time */(time) => time.toLocaleTimeString().split(':')
    //         let timeLeft_ms = (this.distance / this.speed) * 1000
    //
    //         const velocity = this.speed / 1000   // м/мс
    //
    //         const drivingTime = Activity.EVENING_TIME - Activity.MORNING_TIME
    //
    //         let currentTime = new Date(this.start)
    //
    //         while (timeLeft_ms > 0) {
    //             currentTime.getTime()
    //
    //         }
    //     }
    // }

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
        Время в пути: ${this.durationToSting()}
        
        ==================
        `
    }


    /**
     * мнтод позваляет расчитывать расчитывать интервалы времени если ехать с останвками
     * @static
     * @name RoadActivity.drivingIntervals
     * @param {Date} start время начала движения
     * @param {number} morning время начала движения
     * @param {number} evening время заврешения движения
     * @param {number} speed скорость (м/с)
     * @param {number} distance растояние (м)
     * @return {{distance: number, start: Date, end:Date}[]}
     */
    static drivingIntervals(start, morning, evening, speed, distance) {
        /**@type{{distance: number, start: Date, end:Date}[]}*/
        const pathSlices = [];

        let tempDistance = distance;
        const finalTime = new Date(start);
        const velocity_ms = speed / 1000;
        const evening_ms = evening * 60 * 60 * 1000;
        const morning_ms = morning * 60 * 60 * 1000;
        const night_ms = MS_IN_DAY - evening_ms + morning_ms;

        const timeZoneOffset = start.getTimezoneOffset() * 60 * 1000;

        let start_ms = Math.abs((finalTime.getTime() - timeZoneOffset) % MS_IN_DAY);
        if (start_ms >= evening_ms)
            incriceTime(finalTime, MS_IN_DAY - start_ms + morning_ms);

        let count = 0;

        /**@type{{distance: number, start: Date, end:Date}}*/
        let pathSlice;
        while (tempDistance > 0) {
            let start;
            let end;

            count += 1;
            start_ms = Math.abs((finalTime.getTime() - timeZoneOffset) % MS_IN_DAY);
            if (start_ms >= evening_ms) {
                incriceTime(finalTime, MS_IN_DAY - start_ms + morning_ms);
                continue;
            }

            let s = (evening_ms - start_ms) * velocity_ms;

            if (s >= tempDistance) {
                const dt = tempDistance / velocity_ms;
                start = new Date(finalTime);
                incriceTime(finalTime, dt);
                end = new Date(finalTime);
                pathSlice = { distance: tempDistance, start, end };
                pathSlices.push(pathSlice);
                break;
            }

            tempDistance -= s;
            start = new Date(finalTime);
            if (count === 1) {
                incriceTime(finalTime, evening_ms - start_ms);
                end = new Date(finalTime);
                incriceTime(finalTime, MS_IN_DAY - evening_ms + morning_ms);
            } else {
                incriceTime(finalTime, evening_ms - start_ms);
                end = new Date(finalTime);
                incriceTime(finalTime, MS_IN_DAY - evening_ms + morning_ms);
            }

            pathSlice = { distance: s, start, end };
            pathSlices.push(pathSlice);
        }

        return pathSlices;
    }

}


/**
 * @param {Date} time
 * @param {number} ms
 * @returns {Date}
 */
function incriceTime(time, ms = 0) {
    time.setTime(time.getTime() + ms)
    return time
}