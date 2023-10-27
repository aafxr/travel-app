import constants from "../../static/constants";

/***
 * @description - описание структуры бд store
 * @type {DBSchemaType}
 */
const schema = {
    dbname: 'travelAppStore',
    version: 22,
    stores: [
        {
            name: constants.store.STORE,
            key: 'name',
            indexes: [],
        },
        {
            name: constants.store.CURRENCY,
            key: 'date',
            indexes: [],

        },
        {
            name: constants.store.IMAGES,
            key: 'id',
            indexes: [],
        },
        {
            name: constants.store.USERS,
            key: 'id',
            indexes: [],
        },
        {
            name: constants.store.STORE_ACTIONS,
            key: 'id',
            indexes: ['synced', 'entity', 'action'],
        },
        //================ expenses ===================================================================================
        {
            name: constants.store.SECTION,
            key: 'id',
            indexes: [],
            upgrade: []
        },
        {
            name: constants.store.LIMIT,
            key: 'id',
            indexes: ['section_id', 'personal', constants.indexes.PRIMARY_ENTITY_ID, "user_id"],
        },
        {
            name: constants.store.EXPENSES_ACTUAL,
            key: 'id',
            indexes: ['user_id', constants.indexes.PRIMARY_ENTITY_ID, 'section_id'],
            upgrade: []
        },
        {
            name: constants.store.EXPENSES_PLAN,
            key: 'id',
            indexes: ['user_id', constants.indexes.PRIMARY_ENTITY_ID, 'section_id'],
        },
        {
            name: constants.store.EXPENSES_ACTIONS,
            key: 'id',
            indexes: ['synced', 'entity', 'action'],
        },
        //================ travels ===================================================================================
        {
            name: constants.store.TRAVEL,
            key: 'id',
            indexes: [],
        },
        {
            name: constants.store.TRAVEL_ACTIONS,
            key: 'id',
            indexes: ['synced', 'entity', 'action'],
        },
        {
            name: constants.store.CHECKLIST,
            key: 'id',
            indexes: [constants.indexes.PRIMARY_ENTITY_ID],
        },
        {
            name: constants.store.TRAVEL_WAYPOINTS,
            key: 'id',
            indexes: [constants.indexes.PRIMARY_ENTITY_ID]
        },
        {
            name: constants.store.UPDATE,
            key: 'primary_id',
            indexes: []
        },
        //================ errors ===================================================================================
        {
            name: constants.store.ERRORS,
            key: 'time',
            indexes: []
        },
        //================ hotels ===================================================================================
        {
            name: constants.store.HOTELS,
            key: 'id',
            indexes: [constants.indexes.PRIMARY_ENTITY_ID]
        },
        //================ appointments =============================================================================
        {
            name: constants.store.APPOINTMENTS,
            key: 'id',
            indexes: [constants.indexes.PRIMARY_ENTITY_ID]
        },
        //================ updated Travel Info =======================================================================
        {
            name: constants.store.UPDATED_TRAVEL_INFO,
            key: constants.indexes.PRIMARY_ENTITY_ID,
            indexes: [constants.indexes.UPDATED_AT]
        }

    ],
};

export default schema;