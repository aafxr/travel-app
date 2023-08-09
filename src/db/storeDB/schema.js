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
    version: 12,
    stores: [
        {
            name: constants.store.STORE,
            key: 'name',
            indexes: [],
        },
    ],
};

export default schema;