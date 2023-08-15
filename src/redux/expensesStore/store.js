import {createSlice} from "@reduxjs/toolkit";

/**
 * @typedef {Object} ExpensesReducerState
 * @property {ActionController | null} controller
 * @property {SectionType | null} defaultSection
 * @property {Array.<SectionType> | []} sections
 * @property {Array.<LimitType> | []} limits
 * @property {Array.<ExpenseType> | []} expensesActual
 * @property {Array.<ExpenseType> | []} expensesPlan
 * @property {Array.<CurrencyType> } currency
 */

/**
 * @type ExpensesReducerState
 */
const initialState = {
    controller: null,
    defaultSection: null,
    limits: [],
    sections: [],
    expensesActual: [],
    expensesPlan: [],
    currency: [],
}


export const expensesSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        /**
         * @param {ExpensesReducerState} state
         * @param action
         */
        addExpenseActual(state, action){
        state.expensesActual.push(action.payload)
        },

        /**
         * @param {ExpensesReducerState} state
         * @param action
         */
        addExpensePlan(state, action){
            state.expensesPlan.push(action.payload)
        },

        /**
         * @param {ExpensesReducerState} state
         * @param action
         */
        addLimit(state, action){
            state.limits.push(action.payload)
        },

        /**
         * @param {ExpensesReducerState} state
         * @param action
         */
        updateExpenseActual(state, action){
            return  state.expensesActual.map(e => e.id === action.payload.id ? action.payload : e)
        },

        /**
         * @param {ExpensesReducerState} state
         * @param action
         */
        updateExpensePlan(state, action){
            return  state.expensesPlan.map(e => e.id === action.payload.id ? action.payload : e)
        },

        /**
         * @param {ExpensesReducerState} state
         * @param action
         */
        updateLimit(state, action){
            state.limits.map(l => l.id === action.payload.id ? action.payload : l)
        },

        /**
         * @param {ExpensesReducerState} state
         * @param action
         */
        removeExpenseActual(state, action){
            return  state.expensesActual.map(e => e.id !== action.payload.id )
        },

        /**
         * @param {ExpensesReducerState} state
         * @param action
         */
        removeExpensePlan(state, action){
            return  state.expensesPlan.map(e => e.id !== action.payload.id)
        },

        /**
         * @param {ExpensesReducerState} state
         * @param action
         */
        removeLimit(state, action){
            return state.expensesPlan.map(l => l.id !== action.payload.id)
        }
    },
})

export const {
    addExpenseActual,
    addExpensePlan,
    addLimit,
    removeExpenseActual,
    removeExpensePlan,
    removeLimit,
    updateExpenseActual,
    updateExpensePlan,
    updateLimit,
} = expensesSlice.actions

export default expensesSlice.reducer
