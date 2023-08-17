import {createSlice} from "@reduxjs/toolkit";
import {initTravelsThunk} from "./initTravelsThunk";

/**
 * @typedef {Object} TravelState
 * @property {import('../models/travel/TravelType').TravelType[]} travels
 * @property {import('../models/travel/TravelType').TravelType} travel
 */

/**
 * @type TravelState
 */
const initialState = {
    travels: [],
    travel: null,
}


export const travelsSlice = createSlice({
        name: 'travels',
        initialState,
        reducers: {
            /**
             * @param {TravelState} state
             * @param action
             */
            selectTravel(state, action) {
                state.travel = action.payload
            },

            /**
             * @param {TravelState} state
             * @param action
             */
            addTravels(state, action) {
                state.travels.push(action.payload)
            },

            /**
             * @param {TravelState} state
             * @param action
             */
            updateTravels(state, action) {
                const idx = state.travels.findIndex(t => t.id === action.payload.id)
                if (~idx) {
                    state.travels[idx] = action.payload
                }
            },

            /**
             * @param {TravelState} state
             * @param action
             */
            removeTravels(state, action) {
                state.travels = state.travels.filter(t => t.id !== action.payload.id)
            },

            /**
             * @param {TravelState} state
             * @param action
             */
            setTravels(state,action){
                if(!Array.isArray(action.payload))
                    console.error(new Error('Travels must be array'))
                state.travels = action.payload
            },
        },

        extraReducers: (builder) => {
            builder.addCase(initTravelsThunk.fulfilled, (state, action) => {
                state.travels = action.payload.travels
            })
        }
    }
)

export const travelActions = travelsSlice.actions

export const travelReducer = travelsSlice.reducer
