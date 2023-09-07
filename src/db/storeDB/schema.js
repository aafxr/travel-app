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
    version: 18 + GLOBAL_DB_VERSION,
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
            name: 'section',
            key: 'id',
            indexes: [],
        },
        {
            name: 'limit',
            key: 'id',
            indexes: ['section_id', 'personal','primary_entity_id', "user_id"],
        },
        {
            name: 'expenses_actual',
            key: 'id',
            indexes: ['user_id', 'primary_entity_id', 'section_id'],
        },
        {
            name: 'expenses_plan',
            key: 'id',
            indexes: ['user_id', 'primary_entity_id', 'section_id'],
        },
        {
            name: 'expensesActions',
            key: 'id',
            indexes: ['synced', 'entity', 'action'],
        },
        //================ travels ===================================================================================
        {
            name: 'travel',
            key: 'id',
            indexes: [],
        },
        {
            name: 'travelActions',
            key: 'id',
            indexes: ['synced', 'entity', 'action'],
        },
        {
            name: 'checklist',
            key: 'id',
            indexes: ['primary_entity_id'],
        }
    ],
};

export default schema;