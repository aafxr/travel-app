import {createAsyncThunk} from "@reduxjs/toolkit";
import storeDB from "../../db/storeDB/storeDB";
import constants from "../../static/constants";

export const initUser = createAsyncThunk('initUser', async (userData, thunkApi) => {
    try {
        if (!userData) return null

        const user = await storeDB.getOne(constants.store.USERS, userData.id)
        let newUserData = userData
        if (user) {
            newUserData = {...user, ...newUserData}
            await storeDB.editElement(constants.store.USERS, newUserData)
        }
        return newUserData
    } catch (err) {
        console.error(err)
        thunkApi.abort()
    }
})