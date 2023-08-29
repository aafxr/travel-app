import {createAsyncThunk} from "@reduxjs/toolkit";
import storeDB from "../../db/storeDB/storeDB";
import constants, {THEME} from "../../static/constants";

export const initUser = createAsyncThunk('initUser', async (userData, thunkApi) => {
    try {
        if (!userData) return null

        const user = await storeDB.getOne(constants.store.USERS, userData.id)
        let newUserData = userData
        if (user) {
            newUserData = {...user, ...newUserData}
        }
        await storeDB.editElement(constants.store.USERS, newUserData)

        //инициализация темы приложения (пибо выбранная пользователем, либо default)
        let theme = localStorage.getItem(THEME)
        if (!theme) {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                theme = 'dark-theme'
            } else {
                theme = 'light-theme'
            }
        }
        return {user: newUserData, theme}
    } catch (err) {
        console.error(err)
        thunkApi.abort()
    }
})