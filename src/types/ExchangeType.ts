/**
 * @name ExchangeType
 * @typedef {Object} ExchangeType
 * @property {number} date
 * @property {CurrencyType[]} value
 * @category Types
 */
import {CurrencyType} from "./CurrencyTypes";


export interface ExchangeType {
    date: number
    value: CurrencyType<any>[]
}