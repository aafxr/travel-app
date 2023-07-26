import isString from "./validation/isString";

/**
 *
 * @param {string} currency
 * @returns {number | null}
 */
export default function currencyToFixedFormat(currency){
    if(isString(currency) && /^\d*([\.,]*)\d*$/.test(currency)){
        let temp =  currency.replace(',', '.')
        temp = parseFloat(temp)

        if(Number.isNaN(temp)){
            return null
        }

        return Math.round(temp * 100) / 100
    }
    return null
}