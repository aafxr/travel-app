import {createSlice} from "@reduxjs/toolkit";
import {initUser} from "./initUser";
import {updateUser} from "./updateUser";
import {THEME} from "../../static/constants";

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
    user: null,
    loading: true,
    theme: 'default'
}


export const userSlice = createSlice({
        name: 'travels',
        initialState,
        reducers: {
            changeTheme(state, action) {
                const themeName = action.payload === 'default' ? 'light-theme' : action.payload
                localStorage.setItem(THEME, action.payload.toString())

                state.theme && document.body.classList.remove(state.theme)
                document.body.classList.add(themeName)

                state.theme = action.payload
            }
        },
        extraReducers: (builder) => {
            builder.addCase(initUser.pending, (state, action) => {
                state.user = action.payload
                state.loading = true
            })

            builder.addCase(initUser.fulfilled, (state, action) => {
                if (action.payload) {
                    state.user = action.payload.user
                    state.loading = false
                    state.theme = action.payload.theme
                }
            })

            builder.addCase(initUser.rejected, (state, action) => {
                state.user = null
                state.loading = false
            })

            builder.addCase(updateUser.fulfilled, (state, action) => {
                state.user = action.payload.user
            })
            builder.addCase(updateUser.rejected, (state, action) => {
                console.log('updateUser rejected')
            })
        }
    }
)

export const userActions = userSlice.actions

export const userReducer = userSlice.reducer
