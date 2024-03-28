type PropType = { [key: string]: any }

/**
 * функция возвращает массив ключей, которые отличаются в объектах
 * @function
 * @name changedFields
 * @param {Object} oldValue объект, поля которого будем сравнивать
 * @param {Object} newValue обновленный обект
 * @param {string[]} extraFields поля, которые будут добавлены в результирующий массив даже если поле не было модифицировано
 * @returns {string[]}
 * @category Utils
 */
export default function changedFields<T extends PropType>(oldValue: T, newValue: T, extraFields: Array<keyof T> = []) {
    if (!oldValue || !newValue) {
        return []
    }
    if (!Array.isArray(extraFields)) {
        console.warn('[changedFields] extraFields should be array')
        return []
    }

    const keys = Object.keys(oldValue)
    const result: string[] = []

    for (const key of keys) {
        if (oldValue[key] !== newValue[key]) {
            result.push(key)
        }
    }
    //если есть новые поля в новом объекте
    Object.keys(newValue).forEach(k => !keys.includes(k) && !result.includes(k) && result.push(k))

    extraFields.forEach(k => !result.includes(k as string) && result.push(k as string))

    return result
}