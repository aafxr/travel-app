/**
 * возвращает массив отфильтрованных значений ( без null / undefined )
 * @param val
 * @returns {[]}
 */
export default function toArray(val){
    if(!val){
        return []
    }
    const result = Array.isArray(val) ? val : [val]
    return result.filter(v => ![null, undefined].includes(v))
}