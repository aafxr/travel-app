/**
 *
 * @param {string} currency
 * @returns {boolean}
 */
export default function currencyTest(currency){
    return /^\d*([\.,]\d\d){0,1}$/.test(currency)
}