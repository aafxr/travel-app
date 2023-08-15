import {useEffect, useState} from "react";
import aFetch from "../../../axios";
import constants, {reducerConstants} from "../../../static/constants";
import storeDB from "../../../db/storeDB/storeDB";

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
 * @param {DispatchFunction} dispatch
 * @returns {CurrencyType[]}
 */
export default async function updateCurrency(dispatch) {
        await aFetch.get('/main/currency/getList/')
            .then(res => res.data)
            .then(data => {
                const c = Object.keys(data).map(k => ({date: k, value: data[k]}) )
                Promise.all(c
                    .map(item => storeDB.editElement(constants.store.CURRENCY, item))
                ).then(() =>
                    storeDB.getOne(constants.store.CURRENCY, new Date().toLocaleDateString())
                        .then(date => {
                            console.log(date)
                            if (date.length) {
                                dispatch({type: reducerConstants.UPDATE_CURRENCY, payload: date.value})
                                localStorage.setItem('currency', JSON.stringify(date.value))
                            }
                        })
                )
            })
            .catch((err) => {
                console.error(err)
                const c = JSON.parse(localStorage.getItem('currency')) || []
                dispatch({type: reducerConstants.UPDATE_CURRENCY, payload: c})
            })
}