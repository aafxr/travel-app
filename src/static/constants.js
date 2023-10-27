import React from "react";

import WalkIcon from "../components/svg/WalkIcon";
import CarIcon from "../components/svg/CarIcon";
import BusIcon from "../components/svg/BusIcon";

export const GLOBAL_DB_VERSION = 1;
export const CACHE_VERSION = 16 + GLOBAL_DB_VERSION;


const constants = {
    store: {
        SECTION: 'section',
        LIMIT: 'limit',
        EXPENSES_ACTUAL: 'expenses_actual',
        EXPENSES_PLAN: 'expenses_plan',
        EXPENSES_ACTIONS: 'expensesActions',

        TRAVEL: 'travel',
        TRAVEL_ACTIONS: 'travelActions',
        CHECKLIST: 'checklist',
        TRAVEL_WAYPOINTS: 'travel_waypoints',

        STORE: 'store',
        CURRENCY: 'currency',
        IMAGES: 'images',
        STORE_ACTIONS: 'storeActions',

        USERS: 'users',
        UPDATE: 'update',

        HOTELS: 'hotels',
        APPOINTMENTS: 'appointment',
        ERRORS: 'errors',

        UPDATED_TRAVEL_INFO: 'updatedTravelInfo'
    },
    indexes: {
        SECTION_ID: 'section_id',
        PERSONAL: 'personal',
        USER_ID: 'user_id',
        PRIMARY_ENTITY_ID: 'primary_entity_id',
        PRIMARY_ENTITY_TYPE: 'primary_entity_type',
        SYNCED: 'synced',
        ENTITY: 'entity',
        ACTION: 'action',
        UPDATED_AT: 'updated_at'
    },
    events: {
        DONE: 'done',
        FAIL: 'fail',
        INIT: 'init',
        FETCH: 'fetch',
        UPDATE: 'update',
        UPDATE_EXP_ACTUAL:'update-expenses-actual',
        UPDATE_EXP_PLANNED:'update-expenses-planned'
    },
    TOTAL_EXPENSES: 'totalExpenses',

    redux: {
        EXPENSES: 'expenses',
        TRAVEL: 'travel',
        USER: 'user',
    }
}


export const reducerConstants = {
    UPDATE_CONTROLLER: 'UPDATE_CONTROLLER',
    UPDATE_EXPENSES_ACTUAL: 'UPDATE_EXPENSES_ACTUAL',
    UPDATE_EXPENSES_PLAN: 'UPDATE_EXPENSES_PLAN',
    UPDATE_EXPENSES_LIMIT: 'UPDATE_EXPENSES_LIMIT',
    UPDATE_EXPENSES_SECTIONS: 'UPDATE_EXPENSES_SECTIONS',
    UPDATE_EXPENSES_DEFAULT_SECTION: 'UPDATE_EXPENSES_DEFAULT_SECTION',
    UPDATE_CURRENCY: 'UPDATE_CURRENCY',
}

export default constants

export const MAX_UPLOAD_FILE_SIZE = 1024 * 1024 * 5 // 5Mb
export const actionsBlackList = [constants.store.SECTION, constants.store.LIMIT]
export const actionsWhiteList = [constants.store.EXPENSES_ACTUAL, constants.store.EXPENSES_PLAN]

export const CRITICAL_ERROR = 'critical_error'

export const DEFAULT_IMG_URL = process.env.PUBLIC_URL + '/images/travel-placeholder.jpg'

export const USER_AUTH = 'USER'

export const ACCESS_TOKEN = 'token'
export const REFRESH_TOKEN = 'refresh_token'
export const UNAUTHORIZED = 'unauthorized'
export const THEME = 'THEME'

export const MS_IN_DAY = 1000 * 60 * 60 * 24 //число милисекунд в в сутках

export const defaultMovementTags = [
    {id: 1, icon: <WalkIcon className='img-abs' />, title: 'пешком'},
    {id: 2, icon: <CarIcon className='img-abs'/>, title: 'авто'},
    {id: 3, icon: <BusIcon className='img-abs'/>, title: 'общественный транспорт'},
]

export const DEFAULT_PLACEMARK_ICON = new URL('../../public/icons/Navigation.png', import.meta.url).toString()