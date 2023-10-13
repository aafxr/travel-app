/**
 * Утилита создает массив индексов в диапазоне от __start__ до __(end - 1)__
 * @function
 * @name range
 * @param {number} start начало диапазона
 * @param {number} end конец диапазона (не вклбчительно)
 * @returns {number[]}
 * @category Utils
 */
export default function range(start, end) {
    let output = []
    if (typeof end === 'undefined') {
        end = start
        start = 0
    }
    for (let i = start; i < end; i += 1) {
        output.push(i)
    }
    return output
}