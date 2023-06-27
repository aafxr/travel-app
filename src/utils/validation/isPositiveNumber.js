/**
 * Является ли value положительным числом
 * @param {number} value >=0
 *@return {boolean}
 */
export default function isPositiveNumber(value) {
    return typeof value === 'number' && value >= 0;
}