/**
 * Является ли значение не пустой строкой
 * @param {string} value
 * @return {boolean}
 */
export default function isString(value) {
    return (typeof value === 'string' || value instanceof String) && value.length > 0;
}