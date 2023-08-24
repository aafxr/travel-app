import {createSlice} from "@reduxjs/toolkit";
import {initUser} from "./initUser";
import {updateUser} from "./updateUser";

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
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(initUser.fulfilled, (state, action) => {
                state.user = action.payload
            })

            builder.addCase(updateUser.fulfilled, (state, action) => {
                state.user = action.payload
            })
        }
    }
)

export const userActions = userSlice.actions

export const userReducer = userSlice.reducer
