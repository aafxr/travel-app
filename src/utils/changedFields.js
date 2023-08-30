/**
 * функция возвращает массив ключей, которые отличаются в объектах
 * @param {Object} oldValue
 * @param {Object} newValue
 * @param {string[]} extraFields
 * @returns {string[]}
 */
export default function changedFields(oldValue, newValue, extraFields= []){
    if(!oldValue || !newValue){
        return []
    }
    if (!Array.isArray(extraFields)){
        console.warn('[changedFields] extraFields should be array')
        return []
    }

    const keys = Object.keys(oldValue)
    const result = []

    for (const key of keys){
        if (oldValue[key] !== newValue[key]){
            result.push(key)
        }
    }
    //если есть новые поля в новом объекте
    Object.keys(newValue).forEach(k => !keys.includes(k) && result.push(k))

    extraFields.forEach(k => !result.includes(k) && result.push(k))

    return result
}