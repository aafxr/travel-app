import {createAsyncThunk} from '@reduxjs/toolkit'
import constants from "../../static/constants";
import aFetch from "../../axios";
import travelDB from "../../db/travelDB/travelDB";

export const initTravelsThunk = createAsyncThunk(
    'initTravelsThunk',
    async (_, thunkAPI) => {
        try {
            const response = await aFetch.get('/travel/getList/')
            let travels = response.data.ok ? response.data.data : []

            await Promise.all(travels.map(t => travelDB.editElement(constants.store.TRAVEL, t)))

            if (!travels.length) {
                travels = await travelDB.getAll(constants.store.TRAVEL)
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