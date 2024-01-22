/**
 * Является ли значение не пустой строкой
 */
export default function isString(value: any) {
    return (typeof value === 'string' || value instanceof String) && value.length > 0;
}