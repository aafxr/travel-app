/**
 * возвращает массив не пересекающихся значений
 * @param arr массив значений
 * @param transformCb callback трансформирует массив
 * @returns {unknown[]|*[]}
 */
export default function distinctValues(arr, transformCb) {
    if (Array.isArray(arr)) {
        const set = new Set(arr.filter(item => item || typeof item === 'number').map(transformCb))
        return [...set]
    } else if (arr) {
        return [transformCb(arr)]
    }
    return []
}