/**
 * @typedef {Object} DateTimeType
 * @param {string | number} [hh]
 * @param {string | number} [mm]
 * @param {string | number} [ss]
 * @param {string | number} [month]
 */

import {MONTH} from "../static/constants";

/**
 * @function
 * @name setDateTime
 * @param {Date | string} date
 * @param {DateTimeType} options
 * @return {Date}
 * @category Utils
 */
export default function setDateTime(date, options = {}){
    const {hh, mm,ss, month} = options
    const _date = new Date(date)

    if(!Number.isNaN(_date.getTime())){
        if (hh) _date.setHours(+hh)
        if (mm) _date.setMinutes(+mm)
        if (ss) _date.setSeconds(+ss)
        if (~MONTH[month]) _date.setMonth(MONTH[month])
    }
    return _date
}