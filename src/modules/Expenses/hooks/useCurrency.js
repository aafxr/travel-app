import {useEffect, useState} from "react";
import aFetch from "../../../axios";

const t = {
    char_code: "KZT",
    name: "Казахстанских тенге",
    num_code: 398,
    symbol: "₸",
    value: 20.3433,
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
 * Возвращает массив с курсом валют
 * @returns {CurrencyType[]}
 */
export default function useCurrency() {
    const [currency, setCurrency] = useState([])

    useEffect(() => {
        aFetch.get('/main/currency/getList/')
            .then(res => res.data)
            .then(data => {
                const c = Object.keys(data).map(k => data[k])[0]
                if (c && c.length) {
                    setCurrency(c)
                    localStorage.setItem('currency', JSON.stringify(c))
                }
            })
            .catch((err) => {
                console.error(err)
                const c = JSON.parse(localStorage.getItem('currency')) || []
                setCurrency(c)
            })
    }, [])

    return currency
}