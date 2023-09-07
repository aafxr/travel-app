import { createAsyncThunk } from '@reduxjs/toolkit'
import storeDB from "../../db/storeDB/storeDB";
import constants from "../../static/constants";

// First, create the thunk
export const updateLimitThunk = createAsyncThunk(
    'updateLimitThunk',
    async (primary_entity_id, thunkAPI) => {
        const limits = await storeDB.getManyFromIndex(
            constants.store.LIMIT,
            constants.indexes.PRIMARY_ENTITY_ID,
            primary_entity_id
        )
        return limits
    }
)