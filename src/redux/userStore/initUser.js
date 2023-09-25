import {createAsyncThunk} from "@reduxjs/toolkit";
import storeDB from "../../db/storeDB/storeDB";
import constants, {THEME} from "../../static/constants";
import defaultThemeClass from "../../utils/defaultThemeClass";
import userLocation from "../../utils/userLocation";

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
        if (!theme || theme === 'default') {
            theme = defaultThemeClass()
        }
        const userLoc = await userLocation().catch(err => null)
        return {user: newUserData, theme, userLoc}
    } catch (err) {
        console.error(err)
        thunkApi.abort()
    }
})