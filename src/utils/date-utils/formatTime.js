/**
 * преобразует Date instance к заданному формату <br/>
 * DD - день <br/>
 * MM - месяц <br/>
 * YYYY - год <br/>
 * hh - часы <br/>
 * mm - минуты <br/>
 * ss - секунды <br/>
 *
 * @function
 * @name formatTime
 * @param {string} template
 * @param {Date} date
 * @return {string}
 */
export default function formatTime(template = '', date){
    if(!date) return template

    const formatter = new Intl.NumberFormat(navigator.language, {minimumIntegerDigits: 2, maximumIntegerDigits: 4, minimumFractionDigits: 0})
    return template
        .replace('DD', formatter.format(date.getDay()))
        .replace('MM', formatter.format(date.getMonth()))
        .replace('YYYY', date.getFullYear().toString())
        .replace('hh', formatter.format(date.getHours()))
        .replace('mm', formatter.format(date.getMinutes()))
        .replace('ss', formatter.format(date.getSeconds()))
}