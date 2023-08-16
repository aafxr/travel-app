import { createAsyncThunk } from '@reduxjs/toolkit'
import expensesDB from "../../db/expensesDB/expensesDB";
import constants from "../../static/constants";
import expensesController from '../../controllers/expensesController/expensesController'

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

        const sections = await expensesDB.getAll(constants.store.SECTION)

        return {
            expensesController,
            expensesActual,
            expensesPlan,
            limits,
            sections
        }
    }
)