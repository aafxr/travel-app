import {createSlice} from "@reduxjs/toolkit";
import {initTravelsThunk} from "./initTravelsThunk";
import createTravel from "../../modules/Travel/helpers/createTravel";

/**@type{TravelType} */
const defaultTravel = {
    id: () => '',
    title: () => '',
    code: () => '',
    owner_id: () => '',

    date_start: () => new Date().toISOString(),
    date_end: () => new Date().toISOString(),

    created_at: () => new Date().toISOString(),
    updated_at: () => new Date().toISOString(),

    hotels: () => [],
    members: () => [],
    appointments: () => [],
    movementTypes: () => [],
}

/**
 * @typedef {Object} TravelState
 * @property {TravelType[]} travels
 * @property {string | null} travelID
 * @property {boolean} travelsLoaded = false
 */

/**
 * @type TravelState
 */
const initialState = {
    travels: [],
    travelID: null,
    travelsLoaded: false
}


export const travelsSlice = createSlice({
        name: 'travels',
        initialState,
        reducers: {
            /**
             * выбор текущего путешествия
             * @param {TravelState} state
             * @param {string} payload -  сущность travel
             */
            selectTravel(state, {payload}) {
                if (typeof payload !== 'string') {
                    console.warn(new Error('[Redux/selectTravel] экшен ожидает олучить id путешествия, но получил ' + typeof payload))
                }
                // console.warn(new Error('select'))
                const idx = state.travels.findIndex(t => t.id === payload)
                if (~idx) {
                    state.travelID = state.travels[idx].id
                    Object.keys(defaultTravel).forEach(key => {
                        if (!state.travels[idx][key]) state.travels[idx][key] = defaultTravel[key]()
                    })
                }
            },
            /**
             * сбрасывает текущее путешествие
             * @param {TravelState} state
             */
            resetTravel(state) {
                state.travelID = null
            },

            /**
             * @param {TravelState} state
             * @param action
             */
            addTravel(state, action) {
                state.travels.push(action.payload)
            },

            /**
             * @param {TravelState} state
             * @param action
             */
            updateTravel(state, action) {
                const idx = state.travels.findIndex(t => t.id === action.payload.id)
                if (~idx) {
                    state.travels[idx] = action.payload
                }
            },

            /**
             * @param {TravelState} state
             * @param action
             */
            removeTravel(state, action) {
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
             * @param {TravelState} state
             * @param action - user_id
             */
            travelInit(state, action) {
                const user = action.payload
                if (!user || !user.id) {
                    console.error(new Error('[Redux/travelInit] Пользователь не авторизован'))
                    return
                }
                const travel = createTravel('', user.id, {
                    waypoints: [],
                    appointments: [],
                    members: [],
                    hotels: [],
                    movementTypes: [],
                    date_start: null,
                    date_end: null,
                })
                state.travelID = travel.id
                state.travels.push(travel)
            },
            // установка дат маршрута ==================================================================================
            /**
             * Установка даты начала путешествия
             * @param {TravelState} state
             * @param {string} payload
             */
            setTravelStartDate(state, {payload}){
                if (!state.travelID){
                    console.warn(new Error('[Redux/setTravelStartDate] путешествие не выбранно'))
                    return
                } else if(typeof payload !== 'string'){
                    console.warn(new Error('[Redux/setTravelStartDate] экшен ожидает получить string, но получил ' + typeof payload))
                    return
                }
                const travel = state.travels.find(t => t.id === state.travelID)
                if (travel) travel.date_start = payload
            },
            /**
             * Установка даты конца путешествия
             * @param {TravelState} state
             * @param {string} payload
             */
            setTravelEndDate(state, {payload}){
                if (!state.travelID){
                    console.warn(new Error('[Redux/setTravelStartDate] путешествие не выбранно'))
                    return
                } else if(typeof payload !== 'string'){
                    console.warn(new Error('[Redux/setTravelStartDate] экшен ожидает получить string, но получил ' + typeof payload))
                    return
                }

                const travel = state.travels.find(t => t.id === state.travelID)
                if (travel) travel.date_end = payload
            },
            // redux actions редактирование заголовка ==================================================================
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
                const travel = state.travels.find(t => t.id === state.travelID)
                if(travel) travel.title = payload
            },
            // redux actions редактирование краткого описания направления ==============================================
            /**
             * установка краткого описания направления путешествия
             * @param state
             * @param {string} payload
             */
            setDirection(state, {payload}) {
                if (!state.travel) {
                    console.warn(new Error('Обращение к travel до инициализации'))
                    return
                }
                if (!payload) {
                    console.warn('[Redux/setDirection] вызов экшена без заголовка')
                    return
                }
                const travel = state.travels.find(t => t.id === state.travelID)
                if(travel) travel.direction = payload
            },
            // экшены для мутации встреч ===============================================================================
            /**
             * экшен ожидает получить информацию о встрече и добавляет ее в массив встреч "appointments"
             * @param state
             * @param {Object} payload
             */
            addAppointment(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('Обращение к travelID до инициализации'))
                    return
                }
                if (typeof payload !== 'object') {
                    console.warn('[Redux/addAppointment] экшен ожидает получить объект, но получил ' + typeof payload)
                    return
                }
                const travel = state.travels.find(t => t.id === state.travelID)
                if(travel) travel.appointments.push(payload)
            },
            /**
             * экшен ожидает получить информацию о массиве встреч и перезаписывает "appointments"
             * @param state
             * @param {Object[]} payload
             */
            setAppointments(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('Обращение к travelID до инициализации'))
                    return
                }
                if (Array.isArray(payload)) {
                    console.warn('[Redux/setAppointments] экшен ожидает получить массив объектов, но получил ' + typeof payload)
                    return
                }
                const travel = state.travels.find(t => t.id === state.travelID)
                if(travel) travel.appointments = [...payload]
            },
            /**
             * экшен ожидает получить информацию о удаляемой встрече и обновляет массив "appointments"
             * @param state
             * @param {Object} payload
             */
            removeAppointments(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('Обращение к travelID до инициализации'))
                    return
                }
                if (typeof payload !== 'object') {
                    console.warn('[Redux/removeAppointments] экшен ожидает получить удаляемый объект, но получил ' + typeof payload)
                    return
                }
                const travel = state.travels.find(t => t.id === state.travelID)
                if(travel) travel.appointments = travel.appointments.filter(a => a !== payload)
            },
            // обработка учачтников путешествия ========================================================================
            /**
             * экшен ожидает получить информацию о участнике путешествия и добавляет ее в массив участников "members"
             * @param state
             * @param {MemberType} payload
             */
            addMember(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('Обращение к travelID до инициализации'))
                    return
                }
                if (typeof payload !== 'object') {
                    console.warn('[Redux/addMember] экшен ожидает получить объект c информацией о участнике путешествия , но получил ' + typeof payload)
                    return
                }
                const travel = state.travels.find(t => t.id === state.travelID)
                if(travel) travel.members.push(payload)
            },
            /**
             * экшен ожидает получить массив c информацией об  участниках и перезаписывает "members"
             * @param state
             * @param {MemberType[]} payload
             */
            setMembers(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('Обращение к travelID до инициализации'))
                    return
                }
                if (Array.isArray(payload)) {
                    console.warn('[Redux/setMembers] экшен ожидает получить массив объектов, но получил ' + typeof payload)
                    return
                }
                const travel = state.travels.find(t => t.id === state.travelID)
                if(travel) travel.members = [...payload]
            },
            /**
             * экшен ожидает получить информацию о участнике путешествия и удаляет ее из массива участников "members"
             * @param state
             * @param {MemberType} payload
             */
            removeMember(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('Обращение к travelID до инициализации'))
                    return
                }
                if (typeof payload !== 'object') {
                    console.warn('[Redux/removeMember] экшен ожидает получить объект c информацией о участнике путешествия , но получил ' + typeof payload)
                    return
                }
                const travel = state.travels.find(t => t.id === state.travelID)
                if(travel) travel.members = travel.members.filter(m => m !== payload)
            },

            // обработка отелей путешествия ========================================================================
            /**
             * экшен ожидает получить информацию об отеле и добавляет ее в массив "hotels"
             * @param state
             * @param {Object} payload
             */
            addHotel(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('Обращение к travelID до инициализации'))
                    return
                }
                if (typeof payload !== 'object') {
                    console.warn('[Redux/addHotel] экшен ожидает получить объект c информацией об отеле , но получил ' + typeof payload)
                    return
                }
                const travel = state.travels.find(t => t.id === state.travelID)
                if(travel) travel.hotels.push(payload)
            },
            /**
             * экшен ожидает получить массив c информацией об  отелях и перезаписывает "hotels"
             * @param state
             * @param {Object[]} payload
             */
            setHotels(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('Обращение к travel до инициализации'))
                    return
                }
                if (Array.isArray(payload)) {
                    console.warn('[Redux/setHotels] экшен ожидает получить массив объектов c информацией об  отелях, но получил ' + typeof payload)
                    return
                }
                const travel = state.travels.find(t => t.id === state.travelID)
                if(travel) travel.hotels = [...payload]
            },
            /**
             * экшен ожидает получить информацию об отеле и удаляет ее из массива "hotels"
             * @param state
             * @param {Object} payload
             */
            removeHotel(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('Обращение к travelID до инициализации'))
                    return
                }
                if (typeof payload !== 'object') {
                    console.warn('[Redux/removeHotel] экшен ожидает получить объект c информацией об отеле , но получил ' + typeof payload)
                    return
                }
                const travel = state.travels.find(t => t.id === state.travelID)
                if(travel) travel.hotels = travel.hotels.filter(h => h !== payload)
            },

            // обработка мест путешествия ========================================================================
            /**
             * добавление нового места маршрута
             * @param state
             * @param {InputPoint} payload
             */
            addWaypoint(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('Обращение к travelID до инициализации'))
                    return
                }
                const waypoint = {...payload}
                if (waypoint?.point.placemark) delete waypoint.point.placemark

                const travel = state.travels.find(t => t.id === state.travelID)
                if(travel) travel.waypoints.push(waypoint)
            },
            /**
             * установка массива мест маршрута
             * @param state
             * @param {InputPoint[]} payload
             */
            setWaypoints(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('Обращение к travelID до инициализации'))
                    return
                }
                if (Array.isArray(payload)) {
                    const travel = state.travels.find(t => t.id === state.travelID)
                    if(travel) travel.waypoints = payload.map(p => {
                        const waypoint = {...p}
                        if (waypoint.point.placemark) delete waypoint.point.placemark
                        return waypoint
                    })
                } else {
                    console.error(new Error('[Redux/setWaypoints] ожидает получить массив точек, получил: ' + payload))
                }
            },
            /**
             * добавление нового места маршрута
             * @param state
             * @param {InputPoint} payload
             */
            removeWaypoint(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('Обращение к travelID до инициализации'))
                    return
                }
                if (typeof payload !== 'object') {
                    console.warn(new Error('[Redux/removeWaypoint] экшен щжидает получить обект с информацией о месте, но получил ' + typeof payload))
                    return
                }

                const travel = state.travels.find(t => t.id === state.travelID)
                if(travel) travel.waypoints = travel.waypoints.filter(w => w !== payload)
            },
            //экшены способов перемещения ==============================================================================
            /**
             * экшен ожидает получить объект с информацией о способах передвижения и добавляеь способ перемещения
             * @param state
             * @param {Array} payload
             */
            addMovementType(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('Обращение к travelID до инициализации'))
                    return
                }
                if (typeof payload !== 'object') {
                    console.warn('[Redux/addMovementType] экшен ожидает получить объект c информацией о способах перемещения, но получил ' + typeof payload)
                }
                const travel = state.travels.find(t => t.id === state.travelID)
                if(travel) travel.movementTypes.push(payload)
            },
            /**
             * экшен ожидает получить массив с информацией о способах передвижения
             * @param state
             * @param {Array} payload
             */
            setMovementTypes(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('Обращение к travelID до инициализации'))
                    return
                }
                if (!Array.isArray(payload)) {
                    console.warn('[Redux/setMovementTypes] экшен ожидает получить массив c информацией о способах перемещения, но получил ' + typeof payload)
                }
                const travel = state.travels.find(t => t.id === state.travelID)
                if(travel) travel.movementTypes = [...payload]
            },
            /**
             * экшен ожидает получить объект с информацией о способах передвижения и удаляет способ перемещения
             * @param state
             * @param {MovementType} payload
             */
            removeMovementType(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('Обращение к travelID до инициализации'))
                    return
                }
                if (typeof payload !== 'object') {
                    console.warn('[Redux/removeMovementType] экшен ожидает получить объект c информацией о способах перемещения, но получил ' + typeof payload)
                }
                const travel = state.travels.find(t => t.id === state.travelID)
                if(travel) travel.movementTypes = travel.movementTypes.filter(mt => mt.id !== payload.id)
            },
        },

        extraReducers: (builder) => {
            builder.addCase(initTravelsThunk.fulfilled, (state, action) => {
                state.travels = action.payload.travels
                state.travelsLoaded = true
            })
            builder.addCase(initTravelsThunk.rejected, (state, action) => {
                state.travels = []
                state.travelsLoaded = false
            })
        }
    }
)

export const travelActions = travelsSlice.actions

export const travelReducer = travelsSlice.reducer
