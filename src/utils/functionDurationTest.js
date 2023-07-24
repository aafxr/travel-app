/**
 * замеряет время работы переданной функции
 * @param {Function} cb
 * @param {string} message default = '
 * @returns {*|Promise<unknown>}
 */
export default function functionDurationTest(cb, message= '') {
    const start = Date.now()
    const res = cb()
    if (res instanceof Promise) {
        return res.then((data) => {
            printMessage(message, start)
            return data
        })
    } else {
        printMessage(message, start)
        return res
    }
}


function printMessage(message, start) {
    console.log(message + (Date.now() - start) + ' ms')
}