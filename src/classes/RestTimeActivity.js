import Activity from "./Activity";
import dateToStringFormat from "../utils/dateToStringFormat";
import {MS_IN_DAY} from "../static/constants";

/**
 * @typedef {ActivityOptionsType} RestTimeActivityOptionsTime
 * @property {Date} startTime
 * @property {Date} endTime
 */

export default class RestTimeActivity extends Activity {
    /**
     * @param {RestTimeActivityOptionsTime} options
     */
    constructor(options) {
        super(options)
        if(!options.startTime || !options.endTime)
            throw new Error('RestTimeActivity options should contain "startTime" and "endTime" fields')

        this.status = Activity.REST_TIME

        this.start = new Date(options.startTime)
        this.end = new Date(options.endTime)
        this.duration = this.end - this.start

        this._init()
    }

    _init() {
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


    toString() {
        const {hh, mm, ss} = this.getDuration()

        return `
        ==================

          ____  ____   ___   ___
         /___  /___/  /__   /__
        /     /  \\   /__   /__

        Начало: ${dateToStringFormat(this.start.toISOString())}
        Закончится: ${dateToStringFormat(this.end.toISOString())}
        длительность: ${hh}:${mm > 9 ? mm : '0' + mm}:${ss > 9 ? ss : '0' + ss}

        ==================
        `
    }

    isRest() {
        return true
    }
}