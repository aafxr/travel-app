const month = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

/**
 *
 * @param {string} start
 * @param {string} end
 * @returns {string}
 * @function
 * @name dateRange
 * @category Utils
 */
export default function dateRange(start, end) {
    if (!start && !end) return ''
    if (!start || !end || start === end) {
        const date = new Date(start || end)
        return `${date.getDate()} ${month[date.getMonth()]}`
    }

    const sd = new Date(start)
    const ed = new Date(end)

    if (sd.getMonth() === ed.getMonth()) return `${sd.getDate()} - ${ed.getDate()} ${month[sd.getMonth()]}`
    else if (sd.getFullYear() === ed.getFullYear()) return `${sd.getDate()} ${month[sd.getMonth()]} - ${ed.getDate()} ${month[ed.getMonth()]}`

    return `${sd.getDate()} ${month[sd.getMonth()]} - ${ed.getDate()} ${month[ed.getMonth()]}`
}