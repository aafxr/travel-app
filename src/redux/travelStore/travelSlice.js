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
            setTravels(state, action) {
                if (!Array.isArray(action.payload))
                    console.error(new Error('Travels must be array'))
                state.travels = action.payload
            },
            // redux actions сосздания нового маршрута =================================================================
            /**
             *экшен ожидает получить id прользователя для создания нового путешестчия
             * @param state
             * @param action - user_id
             */
            buildTravelInit(state, action) {
                if (!action.payload.user) {
                    console.error(new Error('Пользователь не авторизован'))
                    return
                }
                state.buildTravel = createTravel('', action.payload.user.id, {
                    appointments: [],
                    members: [],
                    hotels: [],
                    movementTypes: []
                })
            },
            /**
             * установка названия путешествия
             * @param state
             * @param {string} payload
             */
            buildTravelSetTitle(state, {payload}) {
                if (!payload) {
                    console.warn('[Redux/buildTravelSetTitle] вызов экшена без заголовка')
                    return
                }
                state.buildTravel.title = payload
            },
            /**
             * экшен ожидает получить информацию о встрече и добавляет ее в массив встреч "appointments"
             * @param state
             * @param {Object} payload
             */
            buildTravelAddAppointment(state, {payload}) {
                if (typeof payload !== 'object') {
                    console.warn('[Redux/buildTravelAddAppointment] экшен ожидает получить объект, но получил ' + typeof payload)
                    return
                }
                state.buildTravel.appointments.push(payload)
            },
            /**
             * экшен ожидает получить информацию о массиве встреч и перезаписывает "appointments"
             * @param state
             * @param {Object[]} payload
             */
            buildTravelSetAppointments(state, {payload}) {
                if (Array.isArray(payload)) {
                    console.warn('[Redux/buildTravelSetAppointments] экшен ожидает получить массив объектов, но получил ' + typeof payload)
                    return
                }
                state.buildTravel.appointments = [...payload]
            },
            /**
             * экшен ожидает получить информацию о участнике путешествия и добавляет ее в массив участников "members"
             * @param state
             * @param {Object} payload
             */
            buildTravelAddMember(state, {payload}) {
                if (typeof payload !== 'object') {
                    console.warn('[Redux/buildTravelAddMember] экшен ожидает получить объект c информацией о участнике путешествия , но получил ' + typeof payload)
                    return
                }
                state.buildTravel.members.push(payload)
            },
            /**
             * экшен ожидает получить массив c информацией об  участниках и перезаписывает "members"
             * @param state
             * @param {Object[]} payload
             */
            buildTravelSetMembers(state, {payload}) {
                if (Array.isArray(payload)) {
                    console.warn('[Redux/buildTravelSetMembers] экшен ожидает получить массив объектов, но получил ' + typeof payload)
                    return
                }
                state.buildTravel.members = [...payload]
            },

            /**
             * экшен ожидает получить информацию об отеле и добавляет ее в массив "hotels"
             * @param state
             * @param {Object} payload
             */
            buildTravelAddHotel(state, {payload}) {
                if (typeof payload !== 'object') {
                    console.warn('[Redux/buildTravelAddHotel] экшен ожидает получить объект c информацией об отеле , но получил ' + typeof payload)
                    return
                }
                state.buildTravel.hotels.push(payload)
            },
            /**
             * экшен ожидает получить массив c информацией об  отелях и перезаписывает "hotels"
             * @param state
             * @param {Object[]} payload
             */
            buildTravelSetHotels(state, {payload}) {
                if (Array.isArray(payload)) {
                    console.warn('[Redux/buildTravelSetHotels] экшен ожидает получить массив объектов c информацией об  отелях, но получил ' + typeof payload)
                    return
                }
                state.buildTravel.hotels = [...payload]
            },

            /**
             * добавление новой точки маршрута
             * @param state
             * @param {Point} payload
             */
            buildTravelAddWaypoint(state, {payload}) {
                if (!state.buildTravel.waypoints) state.buildTravel.waypoints = []

                state.buildTravel.waypoints.push(payload)
            },
            /**
             * установка массива точек маршрута
             * @param state
             * @param {Point[]} payload
             */
            buildTravelSetWaypoints(state, {payload}) {
                if (Array.isArray(payload)) {
                    state.buildTravel.waypoints = payload
                } else {
                    console.error(new Error('buildTravelSetWaypoints ожидает получить массив точек, получил: ' + payload))
                }
            },
            /**
             * экшен ожидает получить массив с информацией о способах передвижения
             * @param state
             * @param {Array} payload
             */
            buildTravelSetMovementTypes(state, {payload}) {
                if (!Array.isArray(payload)) {
                    console.warn('[Redux/buildTravelSetMovementTypes] экшен ожидает получить массив c информацией о способах перемещения, но получил ' + typeof payload)
                }
                state.buildTravel.movementTypes = [...payload]
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
