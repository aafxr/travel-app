// import {createSlice} from "@reduxjs/toolkit";
// import {initExpensesThunk} from "./initExpensesThunk";
// import {updateLimitThunk} from "./updateLimitThunk";
// import {updateCurrencyThunk} from "./updateCurrencyThunk";
//
// /**
//  * @typedef {Object} ExpensesReducerState
//  * @property {SectionType | null} defaultSection
//  * @property {Array.<SectionType> | []} sections
//  * @property {Array.<LimitType> | []} limits
//  * @property {Array.<ExpenseType> | []} expensesActual
//  * @property {Array.<ExpenseType> | []} expensesPlan
//  * @property {Array.<CurrencyType> } currency
//  */
//
// /**
//  * @typedef{Object} StateType
//  * @property {ExpensesReducerState} expenses
//  */
//
// /**
//  * @type ExpensesReducerState
//  */
// const initialState = {
//     defaultSection: null,
//     limits: [],
//     sections: [],
//     expensesActual: [],
//     expensesPlan: [],
//     currency: [],
// }
//
//
// export const expensesSlice = createSlice({
//     name: 'expenses',
//     initialState,
//     reducers: {
//         //===================== ExpensesActual ========================================================================================
//         /**
//          * @param {ExpensesReducerState} state
//          * @param action
//          */
//         setExpensesActual(state,action){
//             if(!Array.isArray(action.payload))
//                 console.error(new Error('ExpensesComponent Actual must be array'))
//             state.expensesActual = action.payload
//         },
//
//         /**
//          * @param {ExpensesReducerState} state
//          * @param action
//          */
//         addExpenseActual(state, action) {
//             state.expensesActual = Array.isArray(action.payload)
//                 ? state.expensesActual.concat(action.payload)
//                 : state.expensesActual.push(action.payload.id)
//         },
//
//         /**
//          * @param {ExpensesReducerState} state
//          * @param action
//          */
//         updateExpenseActual(state, action) {
//             const idx = state.expensesActual.findIndex(e => e.id === action.payload.id)
//             if(~idx){
//                 state.expensesActual[idx] = action.payload
//             }
//         },
//
//         /**
//          * @param {ExpensesReducerState} state
//          * @param action
//          */
//         removeExpenseActual(state, action) {
//             state.expensesActual =  state.expensesActual.filter(e => e.id !== action.payload.id)
//         },
//
//         //===================== ExpensesPlan ========================================================================================
//
//         /**
//          * @param {ExpensesReducerState} state
//          * @param action
//          */
//         setExpensesPlan(state,action){
//             if(!Array.isArray(action.payload))
//                 console.error(new Error('ExpensesComponent Plan must be array'))
//             state.expensesPlan = action.payload
//         },
//
//         /**
//          * @param {ExpensesReducerState} state
//          * @param action
//          */
//         addExpensePlan(state, action) {
//             state.expensesPlan = Array.isArray(action.payload)
//                 ? state.expensesPlan.concat(action.payload)
//                 : state.expensesPlan.push(action.payload.id)
//         },
//
//         /**
//          * @param {ExpensesReducerState} state
//          * @param action
//          */
//         updateExpensePlan(state, action) {
//             const idx = state.expensesPlan.findIndex(e => e.id === action.payload.id)
//             if(~idx){
//                 state.expensesPlan[idx] = action.payload
//             }
//         },
//
//         /**
//          * @param {ExpensesReducerState} state
//          * @param action
//          */
//         removeExpensePlan(state, action) {
//             state.expensesPlan = state.expensesPlan.filter(e => e.id !== action.payload.id)
//         },
//
//         //===================== ExpensesLimit ========================================================================================
//
//         /**
//          * @param {ExpensesReducerState} state
//          * @param action
//          */
//         setExpensesLimit(state,action){
//             if(!Array.isArray(action.payload))
//                 console.error(new Error('ExpensesComponent Limits must be array'))
//             state.limits = action.payload
//         },
//
//         /**
//          * @param {ExpensesReducerState} state
//          * @param action
//          */
//         addLimit(state, action) {
//             state.limits = Array.isArray(action.payload)
//                 ? state.limits.concat(action.payload)
//                 : state.limits.push(action.payload.id)
//         },
//
//         /**
//          * @param {ExpensesReducerState} state
//          * @param action
//          */
//         updateLimit(state, action) {
//             const idx = state.limits.findIndex(e => e.id === action.payload.id)
//             if(~idx){
//                 state.limits[idx] = action.payload
//             }
//         },
//
//         /**
//          * @param {ExpensesReducerState} state
//          * @param action
//          */
//         removeLimit(state, action) {
//             state.limits = state.limits.filter(l => l.id !== action.payload.id)
//         },
//
//         //===================== ExpensesSections ========================================================================================
//
//         /**
//          * @param {ExpensesReducerState} state
//          * @param action
//          */
//         setSections(state,action){
//             if(!Array.isArray(action.payload))
//                 console.error(new Error('ExpensesComponent Limits must be array'))
//             state.sections = action.payload
//         },
//
//         /**
//          * @param {ExpensesReducerState} state
//          * @param action
//          */
//         addSections(state, action) {
//             state.sections = Array.isArray(action.payload)
//                 ? state.sections.concat(action.payload)
//                 : state.sections.push(action.payload)
//         },
//
//         /**
//          * @param {ExpensesReducerState} state
//          * @param action
//          */
//         updateSections(state, action) {
//             const idx = state.limits.findIndex(e => e.id === action.payload.id)
//             if(~idx){
//                 state.limits[idx] = action.payload
//             }
//         },
//
//         /**
//          * @param {ExpensesReducerState} state
//          * @param action
//          */
//         removeSections(state, action) {
//             state.limits = state.limits.filter(l => l.id !== action.payload.id)
//         },
//
//         //===================== ExpensesSections ========================================================================================
//         /**
//          * @param {ExpensesReducerState} state
//          * @param action
//          */
//         setDefaultSection(state,action){
//             state.defaultSection = action.payload
//         },
//     },
//
//     extraReducers: (builder) => {
//         builder.addCase(initExpensesThunk.fulfilled, (state, action) => {
//             state.expensesActual = action.payload.expensesActual
//             state.expensesPlan = action.payload.expensesPlan
//             state.limits = action.payload.limits
//             state.sections = action.payload.sections
//             state.currency = action.payload.currency
//         })
//         builder.addCase(updateLimitThunk.fulfilled, (state, action) => {
//             state.limits = action.payload
//         })
//         builder.addCase(updateCurrencyThunk.fulfilled, (state, action) => {
//             state.currency = action.payload
//         })
//     }
// })
//
// export const expensesActions = expensesSlice.actions
//
// export const expensesReducer = expensesSlice.reducer
