import range from "../utils/range";
import constants, {MS_IN_DAY} from "../static/constants";
import storeDB from "../db/storeDB/storeDB";

export function generateCurrency(dyas = 2000){
const time = new Date().setHours(0,0,0,0)
const promises = range(0, dyas)
    .map(i => {

        const date = new Date(time - MS_IN_DAY * i)
            .getTime()
        /**@type{CurrencyType}*/
        const rub = {char_code:"RUB", name: 'Рубль', value: 1, num_code: 643, symbol: '₽'}
        /**@type{CurrencyType}*/
        const usd = {char_code:"USD", name: 'Доллар', value: Math.random() * 100, num_code: 654, symbol: '$'}
        /**@type{CurrencyType}*/
        const eur = {char_code:"EUR", name: 'Евро', value: Math.random() * 100, num_code: 593, symbol: '€'}
        /**@type{CurrencyType}*/
        const cny = {char_code:"CNY", name: 'Рубль', value: Math.random() * 30, num_code: 683, symbol: 'د.إ'}
        /**@type{CurrencyType}*/
        const kzt = {char_code:"KZT", name: 'Рубль', value: Math.random() * 10000, num_code: 603, symbol: '₯'}
        /** @type{ExchangeType}*/
        const res= {date, value: [rub, usd, eur, cny, kzt]}
        return res
    })
    .map(ex => storeDB.editElement(constants.store.CURRENCY, ex))
}