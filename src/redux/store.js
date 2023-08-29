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

export const actions = {expensesActions,travelActions,userActions}