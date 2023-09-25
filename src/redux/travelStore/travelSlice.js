import {createSlice} from "@reduxjs/toolkit";
import {initTravelsThunk} from "./initTravelsThunk";
import createTravel from "../../modules/Travel/helpers/createTravel";

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
    buildTravel: null
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
            // redux actions сосздания нового маршрута =================================================================
            buildTravelInit(state, action){
                if (!action.payload.user) {
                    console.error(new Error('Пользователь не авторизован'))
                    return
                }
                state.buildTravel = createTravel(action.payload.user.id)
            },
            buildTravelAddWaypoint(state, action){
                if(!state.buildTravel.waypoints) state.buildTravel.waypoints = []

                state.buildTravel.waypoints.push(action.payload)
            },
            buildTravelSetWaypoints(state, action){
                if(Array.isArray(action.payload)){
                    state.buildTravel.waypoints = action.payload
                } else {
                    console.error(new Error('buildTravelSetWaypoints ожидает получить массив точек, получил: ', + action.payload))
                }
            }

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
