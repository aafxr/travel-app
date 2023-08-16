import {createSlice} from "@reduxjs/toolkit";
import {USER_AUTH} from "../../static/constants";

/**
 * @typedef {Object} UserAppType
 * @property {string} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} username
 * @property {string} photo
 * @property {string} token
 * @property {string} refresh_token
 */

/**
 * @typedef {Object} UserState
 * @property {UserAppType | null} user
 */

/**
 * @type UserState
 */
const initialState = {
    user: null
}


export const userSlice = createSlice({
        name: 'travels',
        initialState,
        reducers: {
            /**
             * @param {UserState} state
             * @param action
             */
            updateUser(state, action){
                localStorage.setItem(USER_AUTH, JSON.stringify(action.payload))
                state.user = action.payload
            }
        },

        extraReducers: (builder) => {
        }
    }
)

export const userActions = userSlice.actions

export const userReducer = userSlice.reducer
