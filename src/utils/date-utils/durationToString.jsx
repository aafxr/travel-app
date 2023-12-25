/**
 * преобразует время в __мс__  в формат строуки ( hh:mm:ss)
 * @function
 * @name durationToSting
 * @param {number} duration
 * @return {string}
 */
export default function durationToSting(duration) {
    let time = Math.round(duration / 1000)
    const hour = Math.floor(time / 3600)
    const min = Math.floor(time % 3600 / 60)
    const sec = time % 60

    return `${hour > 9 ? hour : ('0' + hour)}:${min > 9 ? min : ('0' + min)}:${sec > 9 ? sec : ('0' + sec)}`
}