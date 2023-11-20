import isString from "./validation/isString";

/**
 * утилита приводит число к правильному формату
 * @param {string} currency
 * @param {number} fractionDigitsCount default = 2, число значимых знаков после запятой (до которых идет округление)
 * @returns {number | null}
 * @function
 * @name currencyToFixedFormat
 * @category Utils
 */
export default function currencyToFixedFormat(currency, fractionDigitsCount = 2){
    if(isString(currency) && /^\d*([.,]*)\d*$/.test(currency)){
        let temp =  currency.replace(',', '.')
        temp = parseFloat(temp)

        if(Number.isNaN(temp)){
            return null
        }

        const frc = Math.pow(10, fractionDigitsCount)
        return Math.round(temp * frc) / frc
    }
    return null
}