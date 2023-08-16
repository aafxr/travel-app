import { createAsyncThunk } from '@reduxjs/toolkit'
import constants from "../../static/constants";
import aFetch from "../../axios";
import travelDB from "../../db/travelDB/travelDB";
import travelController from "../../controllers/travelController/travelController";

export const initTravelsThunk = createAsyncThunk(
    'initTravelsThunk',
    async (primary_entity_id, thunkAPI) => {
        const response = await aFetch.get('/travel/getList/')
        let travels = response.data.ok ? response.data.data : []

        if(!travels.length){
            travels = await travelDB.getAll(constants.store.TRAVEL)
        }

        return {
            travelController,
            travels
        }
    }
)