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
}


export const travelsSlice = createSlice({
        name: 'travels',
        initialState,
        reducers: {
            /**
             * @param {TravelState} state
             * @param payload -  сущность travel
             */
            selectTravel(state, {payload}) {
                state.travel = payload
            },
            resetTravel(state) {
                state.travel = null
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
            travelInit(state, action) {
                const user = action.payload
                if (!user || !user.id) {
                    console.error(new Error('[Redux/travelInit] Пользователь не авторизован'))
                    return
                }
                state.travel = createTravel('', user.id, {
                    waypoints: [],
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
            setTitle(state, {payload}) {
                if (!state.travel) {
                    console.warn(new Error('Обращение к travel до инициализации'))
                    return
                }
                if (!payload) {
                    console.warn('[Redux/setTitle] вызов экшена без заголовка')
                    return
                }
                state.travel.title = payload
            },
            /**
             * экшен ожидает получить информацию о встрече и добавляет ее в массив встреч "appointments"
             * @param state
             * @param {Object} payload
             */
            addAppointment(state, {payload}) {
                if (!state.travel) {
                    console.warn(new Error('Обращение к travel до инициализации'))
                    return
                }
                if (typeof payload !== 'object') {
                    console.warn('[Redux/addAppointment] экшен ожидает получить объект, но получил ' + typeof payload)
                    return
                }
                state.travel.appointments.push(payload)
            },
            /**
             * экшен ожидает получить информацию о массиве встреч и перезаписывает "appointments"
             * @param state
             * @param {Object[]} payload
             */
            setAppointments(state, {payload}) {
                if (!state.travel) {
                    console.warn(new Error('Обращение к travel до инициализации'))
                    return
                }
                if (Array.isArray(payload)) {
                    console.warn('[Redux/setAppointments] экшен ожидает получить массив объектов, но получил ' + typeof payload)
                    return
                }
                state.travel.appointments = [...payload]
            },
            /**
             * экшен ожидает получить информацию о участнике путешествия и добавляет ее в массив участников "members"
             * @param state
             * @param {Object} payload
             */
            addMember(state, {payload}) {
                if (!state.travel) {
                    console.warn(new Error('Обращение к travel до инициализации'))
                    return
                }
                if (typeof payload !== 'object') {
                    console.warn('[Redux/addMember] экшен ожидает получить объект c информацией о участнике путешествия , но получил ' + typeof payload)
                    return
                }
                state.travel.members.push(payload)
            },
            /**
             * экшен ожидает получить массив c информацией об  участниках и перезаписывает "members"
             * @param state
             * @param {Object[]} payload
             */
            setMembers(state, {payload}) {
                if (!state.travel) {
                    console.warn(new Error('Обращение к travel до инициализации'))
                    return
                }
                if (Array.isArray(payload)) {
                    console.warn('[Redux/setMembers] экшен ожидает получить массив объектов, но получил ' + typeof payload)
                    return
                }
                state.travel.members = [...payload]
            },

            /**
             * экшен ожидает получить информацию об отеле и добавляет ее в массив "hotels"
             * @param state
             * @param {Object} payload
             */
            addHotel(state, {payload}) {
                if (!state.travel) {
                    console.warn(new Error('Обращение к travel до инициализации'))
                    return
                }
                if (typeof payload !== 'object') {
                    console.warn('[Redux/addHotel] экшен ожидает получить объект c информацией об отеле , но получил ' + typeof payload)
                    return
                }
                state.travel.hotels.push(payload)
            },
            /**
             * экшен ожидает получить массив c информацией об  отелях и перезаписывает "hotels"
             * @param state
             * @param {Object[]} payload
             */
            setHotels(state, {payload}) {
                if (!state.travel) {
                    console.warn(new Error('Обращение к travel до инициализации'))
                    return
                }
                if (Array.isArray(payload)) {
                    console.warn('[Redux/setHotels] экшен ожидает получить массив объектов c информацией об  отелях, но получил ' + typeof payload)
                    return
                }
                state.travel.hotels = [...payload]
            },

            /**
             * добавление новой точки маршрута
             * @param state
             * @param {InputPoint} payload
             */
            addWaypoint(state, {payload}) {
                if (!state.travel) {
                    console.warn(new Error('Обращение к travel до инициализации'))
                    return
                }
                const waypoint = {...payload}
                if (waypoint.point.placemark) delete waypoint.point.placemark

                state.travel.waypoints.push(waypoint)
            },
            /**
             * установка массива точек маршрута
             * @param state
             * @param {InputPoint[]} payload
             */
            setWaypoints(state, {payload}) {
                if (!state.travel) {
                    console.warn(new Error('Обращение к travel до инициализации'))
                    return
                }
                if (Array.isArray(payload)) {
                    state.travel.waypoints = payload.map(p => {
                        const waypoint = {...p}
                        if (waypoint.point.placemark) delete waypoint.point.placemark
                        return waypoint
                    })
                } else {
                    console.error(new Error('[Redux/setWaypoints] ожидает получить массив точек, получил: ' + payload))
                }
            },
            /**
             * экшен ожидает получить массив с информацией о способах передвижения
             * @param state
             * @param {Array} payload
             */
            setMovementTypes(state, {payload}) {
                if (!state.travel) {
                    console.warn(new Error('Обращение к travel до инициализации'))
                    return
                }
                if (!Array.isArray(payload)) {
                    console.warn('[Redux/setMovementTypes] экшен ожидает получить массив c информацией о способах перемещения, но получил ' + typeof payload)
                }
                state.travel.movementTypes = [...payload]
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
