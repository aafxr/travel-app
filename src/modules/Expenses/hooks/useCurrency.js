import {useEffect, useState} from "react";

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
        fetch(process.env.REACT_APP_SERVER_URL + '/main/currency/getList/')
            .then(res => res.json())
            .then(data => {
                if (data && data.length) {
                    setCurrency(data)
                    localStorage.setItem('currency', data)
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