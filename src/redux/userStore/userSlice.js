import {createSlice} from "@reduxjs/toolkit";
import {initUser} from "./initUser";
import {updateUser} from "./updateUser";
import {THEME} from "../../static/constants";
import defaultThemeClass from "../../utils/defaultThemeClass";

/**
 * @typedef {Object} UserType
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
 * @property {UserType | null} user
 * @property {boolean} loading
 * @property {ThemeType} theme
 * @property {[number, number] | null} userLoc
 */

/**
 * @type UserState
 */
const initialState = {
    user: null,
    loading: true,
    theme: 'default',
    userLoc: null
}


export const userSlice = createSlice({
        name: 'travels',
        initialState,
        reducers: {
            changeTheme(state, action) {
                const themeName = action.payload === 'default' ? defaultThemeClass() : action.payload
                // debugger
                localStorage.setItem(THEME, action.payload.toString())

                document.body.classList.remove('dark-theme')
                document.body.classList.remove('light-theme')
                document.body.classList.add(themeName)

                state.theme = action.payload
            },
            /**
             * координаты пользователя
             * @param state
             * @param {Array.<number,number>} payload
             */
            setLocation(state, {payload}){
                if (!Array.isArray(payload)){
                    console.warn(new Error('[Redux/setLocation] не верный формат координат'))
                }
                state.userLocation = [...payload]
            }
        },
        extraReducers: (builder) => {
            builder.addCase(initUser.pending, (state, action) => {
                state.user = action.payload
                state.loading = false
            })

            builder.addCase(initUser.fulfilled, (state, action) => {
                if (action.payload) {
                    state.user = action.payload.user
                    state.theme = action.payload.theme
                    state.userLoc = action.payload.userLoc
                }
                    state.loading = false
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
