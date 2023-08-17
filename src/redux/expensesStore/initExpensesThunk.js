import {createAsyncThunk} from '@reduxjs/toolkit'
import expensesDB from "../../db/expensesDB/expensesDB";
import constants from "../../static/constants";
import distinctValues from "../../utils/distinctValues";
import storeDB from "../../db/storeDB/storeDB";

// First, create the thunk
export const initExpensesThunk = createAsyncThunk(
    'initExpensesThunk',
    async (primary_entity_id, thunkAPI) => {
        try {
            const expensesActual = await expensesDB.getManyFromIndex(
                constants.store.EXPENSES_ACTUAL,
                constants.indexes.PRIMARY_ENTITY_ID,
                primary_entity_id
            )

            const expensesPlan = await expensesDB.getManyFromIndex(
                constants.store.EXPENSES_PLAN,
                constants.indexes.PRIMARY_ENTITY_ID,
                primary_entity_id
            )

            const limits = await expensesDB.getManyFromIndex(
                constants.store.LIMIT,
                constants.indexes.PRIMARY_ENTITY_ID,
                primary_entity_id
            )

            const dates = distinctValues(expensesActual, e => new Date(e.datetime).toLocaleDateString())

            const currencyList = await storeDB.getAll(constants.store.CURRENCY)
            const currency = currencyList.reduce((acc, c) => {
                if (!['message', 'ok'].includes(c.date)){
                    acc[c.date] = c.value
                }
                    return acc
            }, {})
            console.log('++++ ', currency)
            const sections = await expensesDB.getAll(constants.store.SECTION)

            return {
                expensesActual,
                expensesPlan,
                limits,
                sections,
                currency
            }
        } catch (err) {
            console.error(err)
            thunkAPI.abort()
        }
    }
)