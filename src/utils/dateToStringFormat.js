const month = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']


/**
 * Функция возвращает отформатированное время
 * @param {string} dateTime
 * @param {boolean} withMonth
 */
export default  function dateToStringFormat(dateTime, withMonth = true){
    let time = new Date(dateTime)
    let minutes = time.getMinutes().toString()
    let result
    minutes = minutes.length < 2 ? 0 + minutes : minutes

    if (Number.isNaN(time)){
        result = '--/--'
    } else if(withMonth){
        result =  time.getUTCDate() + ' ' + month[time.getMonth()] + ' ' + time.getHours() + ':' + minutes
    } else {
        result = time.getHours() + ':' + minutes
    }

    return result
}