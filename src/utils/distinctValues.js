/**
 * @param {Array.<*>} arr
 * @callback {(*) => *} transformCb
 * @returns {unknown[]|*[]}
 */
/**
 * возвращает массив не пересекающихся значений
 * @param arr массив значений
 * @param transformCb callback трансформирует массив
 * @returns {unknown[]|*[]}
 */
export default function distinctValues(arr, transformCb){
    if (Array.isArray(arr)){
        const set = new Set(arr.map(transformCb))
        return [...set].map(i => i)
    }
    return []
}