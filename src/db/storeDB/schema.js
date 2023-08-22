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
    dbname: 'store',
    version: 13 + GLOBAL_DB_VERSION,
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
            name: constants.store.IMAGES_ACTIONS,
            key: 'id',
            indexes: ['synced', 'entity', 'action'],
        },
    ],
};

export default schema;