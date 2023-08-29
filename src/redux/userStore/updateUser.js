import {createAsyncThunk} from "@reduxjs/toolkit";
import storeDB from "../../db/storeDB/storeDB";
import constants, {USER_AUTH} from "../../static/constants";

export const updateUser = createAsyncThunk('updateUser', async (userData, thunkApi) => {
    try {
        if (!userData) {
            thunkApi.abort()
        }

        const user = await storeDB.getOne(constants.store.USERS, userData.id)
        let newUserData = userData
        if (user) {
            newUserData = {...user, ...newUserData}
        }
        await storeDB.editElement(constants.store.USERS, newUserData)
        localStorage.setItem(USER_AUTH, JSON.stringify(newUserData))

        return {user: newUserData}
    } catch (err) {
        console.error(err)
        thunkApi.abort()
    }
})