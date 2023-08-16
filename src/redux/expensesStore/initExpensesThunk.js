import { createAsyncThunk } from '@reduxjs/toolkit'
import expensesDB from "../../db/expensesDB/expensesDB";
import constants from "../../static/constants";
import expensesController from '../../controllers/expensesController/expensesController'
import distinctValues from "../../utils/distinctValues";
import storeDB from "../../db/storeDB/storeDB";

// First, create the thunk
export const initExpensesThunk = createAsyncThunk(
    'initExpensesThunk',
    async (primary_entity_id, thunkAPI) => {
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

        const currencyList = await Promise
            .all(dates.map(d => storeDB.getOne(constants.store.STORE, d)))

        const currency = currencyList.reduce((acc, c) => acc[c.date] = c.value, {})

        const sections = await expensesDB.getAll(constants.store.SECTION)

        return {
            expensesController,
            expensesActual,
            expensesPlan,
            limits,
            sections,
            currency
        }
    }
)