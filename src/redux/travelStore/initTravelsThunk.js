import {createAsyncThunk} from '@reduxjs/toolkit'
import constants from "../../static/constants";
import aFetch from "../../axios";
import storeDB from "../../db/storeDB/storeDB";

export const initTravelsThunk = createAsyncThunk(
    'initTravelsThunk',
    async (_, thunkAPI) => {
        try {
            const response = await aFetch.get('/travel/getList/')
            let travels = response.data.ok ? response.data.data : []

            await Promise.all(travels.map(t => storeDB.editElement(constants.store.TRAVEL, t)))

            if (!travels.length) {
                travels = await storeDB.getAll(constants.store.TRAVEL)
            }
            return {
                travels
            }
        } catch (err) {
            console.error(err)
            thunkAPI.abort()
        }

    }
)