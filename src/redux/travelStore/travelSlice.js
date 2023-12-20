import {createSlice} from "@reduxjs/toolkit";
import {initTravelsThunk} from "./initTravelsThunk";
import createTravel from "../../modules/Travel/helpers/createTravel";
import checkTravelFields from "./checkTravelFields";
import {MS_IN_DAY} from "../../static/constants";

/**@type{TravelType} */
export const defaultTravel = {
    id: () => '',
    title: () => '',
    code: () => '',
    owner_id: () => '',
    photo: () => '',

    date_start: () => {
        const ms = new Date().getTime()
        const shift = ms / MS_IN_DAY
        return new Date(ms - shift).toISOString()
    },
    date_end: () => {
        const ms = new Date().getTime()
        const shift = ms / MS_IN_DAY
        return new Date(ms - shift).toISOString()
    },

    created_at: () => new Date().toISOString(),
    updated_at: () => new Date().toISOString(),

    hotels: () => [],
    members: () => [],
    appointments: () => [],
    movementTypes: () => [],
    waypoints: () => [],
    adults_count: () =>  0,
    childs_count: () =>  0,
    direction: () => '',
    isPublic: () => true,
    places: () => [],
    isFromPoint: () => 0,
    description: () => ''
}

/**
 * @typedef {Object} TravelState
 * @property {TravelType[]} travels
 * @property {string | null} travelID
 * @property {boolean} travelsLoaded = false
 * @property {boolean} isUserLocation = false
 */

/**
 * @type TravelState
 */
const initialState = {
    travels: [],
    travelID: null,
    travelsLoaded: false,
    isUserLocation: false
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
                // console.warn(new OtherPages('select'))
                const idx = state.travels.findIndex(t => t.id === payload)
                if (~idx) {
                    state.travelID = state.travels[idx].id
                    state.travels[idx] = checkTravelFields(state.travels[idx])
                    state.isUserLocation = false
                }
            },
            /**
             * сбрасывает текущее путешествие
             * @param {TravelState} state
             */
            resetTravel(state) {
                state.travelID = null
                state.isUserLocation = false
            },
            /**
             *
             * @param {TravelState} state
             * @param {boolean} payload
             */
            setIsUserLocation(state, {payload}){
                if (typeof payload === 'boolean') state.isUserLocation = payload
            },
            /**
             * @param {TravelState} state
             * @param {TravelType} payload
             */
            addTravel(state, {payload}) {
                const travelIdx = state.travels.findIndex(t => t.id === payload.id)
                if (~travelIdx) state.travels[travelIdx] = payload
                else state.travels.push(payload)
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
            setTravelStartDate(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('[Redux/setTravelStartDate] путешествие не выбранно'))
                    return
                } else if (typeof payload !== 'string') {
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
            setTravelEndDate(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('[Redux/setTravelStartDate] путешествие не выбранно'))
                    return
                } else if (typeof payload !== 'string') {
                    console.warn(new Error('[Redux/setTravelStartDate] экшен ожидает получить string, но получил ' + typeof payload))
                    return
                }

                const travel = state.travels.find(t => t.id === state.travelID)
                if (travel) travel.date_end = payload
            },
            // установка количества участников маршрута ================================================================
            /**
             * Установка числа взрослых участников путешествия
             * @param {TravelState} state
             * @param {number} payload
             */
            setAdultCount(state, {payload}){
                if (!state.travelID) {
                    console.warn(new Error('[Redux/setAdultCount] путешествие не выбранно'))
                    return
                } else if (typeof payload !== 'number') {
                    console.warn(new Error('[Redux/setAdultCount] экшен ожидает получить number, но получил ' + typeof payload))
                    return
                }
                const travel = state.travels.find(t => t.id === state.travelID)
                if (travel) {
                    const adultCount = travel.members.filter(m => !m.isChild)
                    if (adultCount < payload) travel.adults_count = payload
                }

            },
            /**
             * Установка числа детей-участников путешествия
             * @param {TravelState} state
             * @param {number} payload
             */
            setChildCount(state, {payload}){
                if (!state.travelID) {
                    console.warn(new Error('[Redux/setChildCount] путешествие не выбранно'))
                    return
                } else if (typeof payload !== 'number') {
                    console.warn(new Error('[Redux/setChildCount] экшен ожидает получить number, но получил ' + typeof payload))
                    return
                }
                const travel = state.travels.find(t => t.id === state.travelID)
                if (travel) {
                    const childsCount = travel.members.filter(m => m.isChild)
                    if (childsCount < payload) travel.childs_count = payload
                }
            },

            // redux actions редактирование заголовка ==================================================================
            /**
             * установка названия путешествия
             * @param {TravelState} state
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
                if (travel) travel.title = payload
            },
            // redux actions редактирование краткого описания направления ==============================================
            /**
             * установка краткого описания направления путешествия
             * @param {TravelState} state
             * @param {string} payload
             */
            setDirection(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('Обращение к travelID до инициализации'))
                    return
                }
                if (!payload) {
                    console.warn('[Redux/setDirection] вызов экшена без payload')
                    return
                }
                const travel = state.travels.find(t => t.id === state.travelID)
                if (travel) travel.direction = payload
            },
            // экшены для мутации встреч ===============================================================================
            /**
             * экшен ожидает получить информацию о встрече и добавляет ее в массив встреч "appointments"
             * @param {TravelState} state
             * @param {AppointmentType} payload
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
                if (travel) {
                    const appointmentIdx = travel.appointments.findIndex(a => a.id === payload.id)
                    if (~appointmentIdx) travel.appointments[appointmentIdx] = payload
                    else travel.appointments.push(payload)
                }
            },
            /**
             * экшен ожидает получить информацию о массиве встреч и перезаписывает "appointments"
             * @param {TravelState} state
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
                if (travel) travel.appointments = [...payload]
            },
            /**
             * экшен ожидает получить информацию о удаляемой встрече и обновляет массив "appointments"
             * @param {TravelState} state
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
                if (travel) travel.appointments = travel.appointments.filter(a => a !== payload)
            },
            // обработка учачтников путешествия ========================================================================
            /**
             * экшен ожидает получить информацию о участнике путешествия и добавляет ее в массив участников "members"
             * @param {TravelState} state
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
                if (travel) {
                    const memberIdx = travel.members.findIndex(m => m.id === payload.id)
                    if (~memberIdx) travel.members[memberIdx] = payload
                    else travel.members.push(payload)
                    updateMembersCount(state)
                }
            },
            /**
             * экшен ожидает получить массив c информацией об  участниках и перезаписывает "members"
             * @param {TravelState} state
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
                if (travel) travel.members = [...payload]
            },
            /**
             * экшен ожидает получить информацию о участнике путешествия и удаляет ее из массива участников "members"
             * @param {TravelState} state
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
                if (travel) travel.members = travel.members.filter(m => m !== payload)
            },

            // обработка отелей путешествия ========================================================================
            /**
             * экшен ожидает получить информацию об отеле и добавляет ее в массив "hotels"
             * @param {TravelState} state
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
                if (travel) {
                    const hotelIdx = travel.hotels.findIndex(h => h.id === payload.id)
                    if (~hotelIdx) travel.hotels[hotelIdx] = payload
                    else travel.hotels.push(payload)
                }
            },
            /**
             * экшен ожидает получить массив c информацией об  отелях и перезаписывает "hotels"
             * @param {TravelState} state
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
                if (travel) travel.hotels = [...payload]
            },
            /**
             * экшен ожидает получить информацию об отеле и удаляет ее из массива "hotels"
             * @param {TravelState} state
             * @param {HotelType} payload
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
                if (travel) travel.hotels = travel.hotels.filter(h => h.id !== payload.id)
            },

            // обработка мест путешествия ========================================================================
            /**
             * добавление нового места маршрута
             * @param {TravelState} state
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
                if (travel) {
                    const waypointIdx = travel.waypoints.findIndex(a => a.id === payload.id)
                    if (~waypointIdx) travel.waypoints[waypointIdx] = payload
                    else travel.waypoints.push(payload)
                }
            },
            /**
             * установка массива мест маршрута
             * @param {TravelState} state
             * @param {InputPoint[]} payload
             */
            setWaypoints(state, {payload}) {
                if (!state.travelID) {
                    console.warn(new Error('Обращение к travelID до инициализации'))
                    return
                }
                if (Array.isArray(payload)) {
                    const travel = state.travels.find(t => t.id === state.travelID)
                    if (travel) travel.waypoints = payload.map(p => {
                        const waypoint = {...p}
                        if (waypoint.point?.placemark) delete waypoint.point.placemark
                        return waypoint
                    })
                } else {
                    console.error(new Error('[Redux/setWaypoints] ожидает получить массив точек, получил: ' + payload))
                }
            },
            /**
             * добавление нового места маршрута
             * @param {TravelState} state
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
                if (travel) travel.waypoints = travel.waypoints.filter(w => w.id !== payload.id)
            },
            //экшены способов перемещения ==============================================================================
            /**
             * экшен ожидает получить объект с информацией о способах передвижения и добавляеь способ перемещения
             * @param {TravelState} state
             * @param {Object} payload
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
                if (travel) {
                    const movementTypeIdx = travel.movementTypes.findIndex(mt => mt.id === payload.id)
                    if (~movementTypeIdx) travel.movementTypes[movementTypeIdx] = payload
                    else travel.movementTypes.push(payload)
                }
            },
            /**
             * экшен ожидает получить массив с информацией о способах передвижения
             * @param {TravelState} state
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
                if (travel) travel.movementTypes = [...payload]
            },
            /**
             * экшен ожидает получить объект с информацией о способах передвижения и удаляет способ перемещения
             * @param {TravelState} state
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
                if (travel) travel.movementTypes = travel.movementTypes.filter(mt => mt.id !== payload.id)
            },
            // флаг приватности путешествия ============================================================================
            /**
             * экшен устанавливает флаг приватности путешествия
             * @param {TravelState} state
             * @param {boolean} payload
             */
            setPublic(state, {payload}){
                if (!state.travelID) {
                    console.warn(new Error('Обращение к travelID до инициализации'))
                    return
                }
                if(typeof payload === 'boolean'){
                    const travel = state.travels.find(t => t.id === state.travelID)
                    if (travel) travel.isPublic = payload
                }
            }
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

/**
 * обновление соответствия количества участников (не меньше чем число добавленных взрослых / детей)
 * @param {TravelState} state
 */
function updateMembersCount(state){
    if(!state.travelID) return

    let adult = 0
    let child = 0
    const travel = state.travels.find(t => t.id === state.travelID)
    travel.members.forEach(m => m.isChild ? child++ : adult++)
    if(!travel.adults_count || travel.adults_count < adult) travel.adults_count = adult
    if(!travel.childs_count || travel.childs_count < child) travel.childs_count = adult
}

export const travelActions = travelsSlice.actions

export const travelReducer = travelsSlice.reducer
