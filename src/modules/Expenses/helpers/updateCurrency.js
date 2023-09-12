import aFetch from "../../../axios";
import {updateCurrencyThunk} from "../../../redux/expensesStore/updateCurrencyThunk";
import constants, {reducerConstants} from "../../../static/constants";
import storeDB from "../../../db/storeDB/storeDB";

// const t = {
//     char_code: "KZT",
//     name: "Казахстанских тенге",
//     num_code: 398,
//     symbol: "₸",
//     value: 20.3433,
// }
/**@type{RangeType} */
const defaultRange = {
    date_start:new Date().toLocaleDateString(),
    date_end: new Date().toLocaleDateString(),
}

/**
 * @typedef {Object} CurrencyType
 * @property {string} char_code
 * @property {string} name
 * @property {number} num_code
 * @property {string} symbol
 * @property {number} value
 */

/**
 * записывает курс валют в бд (store) и устанавлевает в state значение на текущий день
 * @param {Function} dispatch
 * @param {RangeType} range
 * @returns {CurrencyType[]}
 */
export default async function updateCurrency(dispatch, range) {
    await aFetch.post('/main/currency/getList/',range || defaultRange)
        .then(res => res.data)
        .then(({ok, data}) => {
            if (ok){
                const c = Object.keys(data).map(k => ({date: k, value: data[k]}))
                Promise.all(c
                    .map(item => storeDB.editElement(constants.store.CURRENCY, item))
                ).then(() => {
                        const value = data[new Date().toLocaleDateString()]
                        dispatch(updateCurrencyThunk())
                        localStorage.setItem('currency', JSON.stringify(value))
                    }
                )
            }
        })
        .catch((err) => {
            console.error(err)
            const c = JSON.parse(localStorage.getItem('currency')) || []
            dispatch({type: reducerConstants.UPDATE_CURRENCY, payload: c})
        })
}