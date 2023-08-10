export const GLOBAL_DB_VERSION = 1;
export const CACHE_VERSION = 9;


const constants = {
    store:{
        SECTION: 'section',
        LIMIT: 'limit',
        EXPENSES_ACTUAL: 'expenses_actual',
        EXPENSES_PLAN: 'expenses_plan',
        EXPENSES_ACTIONS: 'expensesActions',

        TRAVEL: 'travel',
        TRAVEL_ACTIONS: 'travelActions',

        STORE: 'store'
    },
    indexes:{
        SECTION_ID:'section_id',
        PERSONAL:'personal',
        USER_ID:'user_id',
        PRIMARY_ENTITY_ID: 'primary_entity_id',
        PRIMARY_ENTITY_TYPE: 'primary_entity_type',
        SYNCED: 'synced',
        ENTITY: 'entity',
        ACTION: 'action',
    },
    TOTAL_EXPENSES: 'totalExpenses'
}

export default constants


export const actionsBlackList = [constants.store.SECTION, constants.store.LIMIT]
export const actionsWhiteList = [constants.store.EXPENSES_ACTUAL, constants.store.EXPENSES_PLAN]

export const CRITICAL_ERROR = 'critical_error'

export const DEFAULT_IMG_URL = process.env.PUBLIC_URL + '/images/travel-placeholder.jpg'

export const USER_AUTH = 'USER'

export const ACCESS_TOKEN = 'token'
export const REFRESH_TOKEN = 'refresh_token'