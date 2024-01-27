/**
 * @name CurrencyType
 * @typedef {Object} CurrencyType
 * @property {string} char_code
 * @property {string} name
 * @property {number} num_code
 * @property {string} symbol
 * @property {number} value
 * @category Types
 */

export type CurrencyName = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
    CNY: 'د.إ',
    KZT: '₯',
}

export interface CurrencyType<T extends keyof CurrencyName>{
    char_code: T
    name: string
    num_code: number
    symbol: CurrencyName[T]
    value: number
}