import {DBStoreDescriptionType} from "../../types/DBStoreDescriptionType";
import {StoreName} from "../../types/StoreName";
import {IndexName} from "../../types/IndexName";

export const DB_NAME = 'travelAppStore'
export const DB_VERSION = 34

export const DB_STORES: DBStoreDescriptionType[] = [
    {
        name: StoreName.STORE,
        key: 'name',
        indexes: [],

    },
    {
        name: StoreName.CURRENCY,
        key: 'date',
        indexes: [],

    },
    {
        name: StoreName.IMAGES,
        key: 'id',
        indexes: [],
    },
    {
        name: StoreName.USERS,
        key: 'id',
        indexes: [],
    },
    //================ action =====================================================================================
    {
        name: StoreName.ACTION,
        key: 'id',
        indexes: [IndexName.SYNCED,IndexName.ENTITY, IndexName.ACTION],
    },
    //================ expenses ===================================================================================
    {
        name: StoreName.SECTION,
        key: 'id',
        indexes: [],
    },
    {
        name: StoreName.LIMIT,
        key: 'id',
        indexes: [IndexName.SECTION_ID,IndexName.PERSONAL, IndexName.PRIMARY_ENTITY_ID,IndexName.USER_ID],
    },
    {
        name: StoreName.EXPENSES_ACTUAL,
        key: 'id',
        indexes: [IndexName.USER_ID, IndexName.PRIMARY_ENTITY_ID, IndexName.SECTION_ID],
    },
    {
        name: StoreName.EXPENSES_PLAN,
        key: 'id',
        indexes: [IndexName.USER_ID, IndexName.PRIMARY_ENTITY_ID, IndexName.SECTION_ID],
    },
    //================ travels ===================================================================================
    {
        name: StoreName.TRAVEL,
        key: 'id',
        indexes: [IndexName.DATE_START],
    },
    {
        name: StoreName.CHECKLIST,
        key: 'id',
        indexes: [IndexName.PRIMARY_ENTITY_ID],
    },
    {
        name: StoreName.TRAVEL_WAYPOINTS,
        key: 'id',
        indexes: [IndexName.PRIMARY_ENTITY_ID]
    },
    {
        name: StoreName.UPDATE,
        key: 'primary_id',
        indexes: []
    },
    {
        name: StoreName.ROUTE,
        key: 'travel_id',
        indexes: []
    },
    //================ errors ===================================================================================
    {
        name: StoreName.ERRORS,
        key: 'time',
        indexes: []
    },
    //================ hotels ===================================================================================
    {
        name: StoreName.HOTELS,
        key: 'id',
        indexes: [IndexName.PRIMARY_ENTITY_ID]
    },
    //================ appointments =============================================================================
    {
        name: StoreName.APPOINTMENTS,
        key: 'id',
        indexes: [IndexName.PRIMARY_ENTITY_ID]
    },
    //================ updated Travel Info =======================================================================
    {
        name: StoreName.UPDATED_TRAVEL_INFO,
        key: IndexName.PRIMARY_ENTITY_ID,
        indexes: [IndexName.UPDATED_AT]
    }

]