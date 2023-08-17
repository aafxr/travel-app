import constants from "../../static/constants";

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
    version: 13,
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
    ],
};

export default schema;