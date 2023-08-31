import {createAsyncThunk} from "@reduxjs/toolkit";
import storeDB from "../../db/storeDB/storeDB";
import constants, {THEME} from "../../static/constants";
import defaultThemeClass from "../../utils/defaultThemeClass";

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
            theme = defaultThemeClass()
        }
        return {user: newUserData, theme}
    } catch (err) {
        console.error(err)
        thunkApi.abort()
    }
})