import { configureStore } from '@reduxjs/toolkit'
import {expensesActions, expensesReducer} from "./expensesStore/expensesSlice";
import {travelActions, travelReducer} from "./travelStore/travelSlice";
import constants from "../static/constants";
import {userActions, userReducer} from "./userStore/userSlice";


export const store = configureStore({
    reducer: {
        [constants.redux.EXPENSES]: expensesReducer,
        [constants.redux.TRAVEL]: travelReducer,
        [constants.redux.USER]: userReducer
    },
})

/**
 * @typedef {{expenses: {controller: (ActionController|null), defaultSection: (SectionType|null), expensesPlan: (Array<ExpenseType>|[]), currency: Array<CurrencyType>, expensesActual: (Array<ExpenseType>|[]), sections: (Array<SectionType>|[]), limits: (Array<LimitType>|[])}, travel: {travels: import('../models/travel/TravelType').TravelType[], travelController: (ActionController|null), travel: import('../models/travel/TravelType').TravelType}} & ExtractStateExtensions<[((next: StoreEnhancerStoreCreator) => StoreEnhancerStoreCreator<{}, {}>)]>} ReduxStateType
 */
const state = store.getState()

export const actions = {expensesActions,travelActions,userActions}