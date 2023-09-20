import constants, {GLOBAL_DB_VERSION} from "../../static/constants";

/**
 * @description - описание структуры бд store
 *
 *
 * dbname - имя бд
 *
 * version - версия
 *
 * stores - набор объектов описывающих storage в бд
 *
 */
const schema = {
    dbname: 'travelAppStore',
    version: 19 + GLOBAL_DB_VERSION,
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
        },
        {
            name: constants.store.LIMIT,
            key: 'id',
            indexes: ['section_id', 'personal','primary_entity_id', "user_id"],
        },
        {
            name: constants.store.EXPENSES_ACTUAL,
            key: 'id',
            indexes: ['user_id', 'primary_entity_id', 'section_id'],
        },
        {
            name: constants.store.EXPENSES_PLAN,
            key: 'id',
            indexes: ['user_id', 'primary_entity_id', 'section_id'],
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
            indexes: ['primary_entity_id'],
        },
        {
            name: constants.store.TRAVEL_WAYPOINTS,
            key: 'id',
            indexes: ['primary_entity_id']
        }
    ],
};

export default schema;