/**
 * возвращает массив не пересекающихся значений
 * @param {Array} arr массив значений
 * @param transformCb callback трансформирует массив
 * @param {Array.<string>} [extraValues] трансформирует массив
 * @returns {unknown[]|*[]}
 * @function
 * @name distinctValues
 * @category Utils
 */
export default function distinctValues(arr, transformCb, extraValues) {
    if (Array.isArray(arr)) {
        const set = new Set(arr.filter(item => item || typeof item === 'number').map(transformCb))
        if (extraValues && Array.isArray(extraValues)) {
            extraValues
                .filter(e => !!e)
                .forEach(e => set.add(e))
        }
        return [...set]
    } else if (arr) {
        return [transformCb(arr)]
    }
    return []
}