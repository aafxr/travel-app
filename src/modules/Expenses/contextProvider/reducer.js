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
 * @typedef {Object} ExpensesReducerAction
 * @property {string} type
 * @property payload
 */

/**
 * @callback DispatchFunction
 * @param {ExpensesReducerAction} action
 */


import {reducerConstants} from "../../../static/constants";



/**
 *
 * @param {ExpensesReducerState} state
 * @param {ExpensesReducerAction} action
 */
export default function expensesReducer(state, action){

    switch (action.type){
        case reducerConstants.UPDATE_EXPENSES_ACTUAL:{
            return {...state, expensesActual: action.payload}
        }
        case reducerConstants.UPDATE_EXPENSES_PLAN:{
            return {...state, expensesPlan: action.payload}
        }
        case reducerConstants.UPDATE_EXPENSES_LIMIT:{
            return {...state, limits: action.payload}
        }
        case reducerConstants.UPDATE_EXPENSES_SECTIONS:{
            return {...state, sections: action.payload}
        }
        case reducerConstants.UPDATE_CONTROLLER:{
            return {...state, controller: action.payload}
        }
        case reducerConstants.UPDATE_CURRENCY:{
            return {...state, currency: action.payload}
        }
        case reducerConstants.UPDATE_EXPENSES_DEFAULT_SECTION:{
            return {...state, defaultSection: action.payload}
        }
        default: {
            return state
        }
    }
}
