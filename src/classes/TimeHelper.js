import {MS_IN_DAY} from "../static/constants";

/**
 * @class
 * @name TimeHelper
 *
 *
 * @param {number} [morning] время в __мс__ - локальное время утра
 * @param {number} [evening] время в __мс__ - локальное время вечера
 * @param {number} timezoneOffset время в __мс__ - смещение относительно часового пояса
 * @constructor
 */
export default class TimeHelper{
    /**
     * @param {number} [morning] время в __мс__ - локальное время утра
     * @param {number} [evening] время в __мс__ - локальное время вечера
     * @constructor
     */
    constructor(morning = 0 , evening = MS_IN_DAY) {
        this.morning = morning
        this.evening = evening
    }

    /**
     * @param {Date} time
     * @return {boolean}
     */
    isAtDayTime(time) {
        const localeTime = this.getLocaleTime_ms(time)
        return localeTime >= this.morning && localeTime <= this.evening
    }

    /**
     * @param {Date} time
     * @returns {boolean}
     */
    isAtNightTime(time) {
        return !this.isAtDayTime(time)
    }

    /**
     * @param {Date} time
     * @returns {boolean}
     */
    isNight(time) {
        return !this.isAtDayTime(time)
    }

    /**
     * @param {Date} time
     * @returns {boolean}
     */
    isDay(time) {
        return !this.isAtDayTime(time)
    }

    /**
     * @param {Date} time
     * @returns {boolean}
     */
    isEqualToMorning(time) {
        return this.getLocaleTime_ms(time) === this.morning
    }

    /**
     * @param {Date} time
     * @returns {boolean}
     */
    isEqualToEvening(time) {
        return this.getLocaleTime_ms(time) === this.evening
    }

    /**
     * return shifted time
     * @param {Date} time
     * @returns {number}
     */
    shiftToMorning(time){
        const localeTime = this.getLocaleTime_ms(time)
        if(localeTime < this.morning){
        const delta =  this.morning - localeTime
            time.setTime(time.getTime() + delta)
            return delta
        }else {
            const delta = MS_IN_DAY - localeTime + this.morning
            time.setTime(time.getTime() + delta)
            return delta
        }
    }

    /**
     * return shifted time
     * @param {Date} time
     * @returns {number}
     */
    shiftToEvening(time){
        const delta =  this.evening - this.getLocaleTime_ms(time)
        time.setTime(time.getTime() + delta)
        return delta
    }

    /**
     * @param {Date} time
     * @returns {number}
     */
    getLocaleTime_ms(time){
        return (time.getTime() - time.getTimezoneOffset() * 60 * 1000) % MS_IN_DAY
    }

    /**
     * @param {Date} time
     * @param {number} ms
     */
    shift(time, ms){
        time.setTime(time.getTime() + ms)
    }

    /**
     * @param {Date[]} times
     * @param {number} ms
     */
    shiftAll(times, ms){
        if(!ms) return
        times.forEach(time => time.setTime(time.getTime() + ms))
    }

    /**
     * @param {Date} time
     * @return {Date}
     */
    toMidnight(time){
        time.setTime(time.getTime() - time.getTime() % MS_IN_DAY  + time.getTimezoneOffset() * 60 * 1000)
        return time
    }

    /**
     * @param {Date} time
     * @return {Date}
     */
    toNextDayMidnight(time){
        time.setTime(time.getTime() - time.getTime() % MS_IN_DAY  + time.getTimezoneOffset() * 60 * 1000 + MS_IN_DAY)
        return time
    }

}