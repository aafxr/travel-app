/**
 * Утилита конвертирует параметр date к виду "01.01.2023"
 * @function
 * @name dateToCurrencyKey
 * @param {string | number} date
 * @returns {string}
 * @category Utils
 */
export default function dateToCurrencyKey(date){
    const d = new Date(date)
    if(!Number.isNaN(d.getTime())){
        return d.toISOString().split('T').shift().split('-').reverse().join('.')
    } else {
        console.error(new Error(`Prop date can not be convert to Date format, value: ${date}`))
        return ''
    }
}