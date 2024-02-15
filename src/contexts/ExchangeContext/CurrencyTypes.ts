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

export interface CurrencyType{
    char_code: keyof CurrencyName
    name: string
    num_code: number
    symbol: CurrencyName[keyof CurrencyName]
    value: number
}