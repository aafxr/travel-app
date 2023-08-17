import {createAsyncThunk} from '@reduxjs/toolkit'
import storeDB from "../../db/storeDB/storeDB";
import constants from "../../static/constants";

/**
 * @typedef {Object} RangeType
 * @property {Date} date_start
 * @property {Date} date_end
 */


export const updateCurrencyThunk = createAsyncThunk(
    'updateCurrencyThunk',
    /**@param {RangeType | undefined} range*/
    async (range, thunkAPI) => {
        try {
            let currencyList
            if (range) {
                currencyList = await storeDB.getMany(constants.store.CURRENCY, IDBKeyRange.bound(range.date_start, range.date_end))
            } else {
                currencyList = await storeDB.getAll(constants.store.CURRENCY)
            }
            return currencyList.reduce((acc, c) => {
                if (!['message', 'ok'].includes(c.date)){
                    acc[c.date] = c.value
                }
                return acc
            }, {})
        } catch (err) {
            console.error(err)
            thunkAPI.abort()
        }
    }
)