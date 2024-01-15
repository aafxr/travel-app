// import {createAsyncThunk} from '@reduxjs/toolkit'
// import storeDB from "../../db/storeDB/storeDB";
// import constants from "../../static/constants";
//
// /**
//  * @typedef {Object} RangeType
//  * @property {Date} date_start
//  * @property {Date} date_end
//  */
//
//
// export const updateCurrencyThunk = createAsyncThunk(
//     'updateCurrencyThunk',
//     /**@param {RangeType | undefined} range*/
//     async (range, thunkAPI) => {
//         try {
//             let currencyList
//             if (range) {
//                 const query = IDBKeyRange.bound(new Date(range.date_start).getTime(), new Date(range.date_end).getTime())
//                 currencyList = await storeDB.getMany(constants.store.CURRENCY, query)
//             } else {
//                 currencyList = await storeDB.getAll(constants.store.CURRENCY)
//             }
//             return currencyList.reduce((acc, c) => {
//                 if (!['message', 'ok'].includes(c.date)){
//                     acc[c.date] = new Date(c.value).getTime()
//                 }
//                 return acc
//             }, {})
//         } catch (err) {
//             console.error(err)
//             thunkAPI.abort()
//         }
//     }
// )