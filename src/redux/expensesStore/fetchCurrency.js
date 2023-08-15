import { createAsyncThunk } from '@reduxjs/toolkit'

// First, create the thunk
const fetchUserById = createAsyncThunk(
    'currency/fetch',
    async (userId, thunkAPI) => {
        const response = await userAPI.fetchById(userId)
        return response.data
    }
)