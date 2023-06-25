import constants from "../db/constants";
import isString from "../../../utils/validation/isString";

/**
 * @typedef {object} SectionType
 * @property {string} [id]
 * @property {string} title
 * @property {string} color
 * @property {boolean | number} hidden
 */

/**
 * @function
 * @name SectionHandler
 * @param {SectionType} data
 * @returns {Promise<*>}
 */

/**
 * проверка на валидность данных секции
 * @param {SectionType} data
 * @returns {boolean}
 */
function isValidData(data) {
    return !!(data.title && data.color && data.hidden
        && isString(data.title)
        && isString(data.color)
        && (typeof data.hidden === 'boolean' || typeof data.hidden === 'number'));
}

/**
 *
 * @param {import('../../../db').LocalDB} db
 * @param {string} user_id
 * @returns {{add(*): SectionHandler, edit(SectionType): Promise<*>, get(*): Promise<*|undefined>, remove(string): Promise<*>}|Promise<number|string|Date|ArrayBufferView|ArrayBuffer|IDBValidKey[]>|*|undefined}
 */
export default function (db, user_id,) {
    return {
        /**
         * Записывает новую секцию в бд
         * @param {SectionType} data
         * @returns {Promise<string>}
         */
        async add(data) {
            if (!isValidData(data)) {
                throw new Error(`[Section.add] Data is not valid: ${JSON.stringify(data)}`);
            }
            const id = user_id + ':' + Date.now();
            const result = await db.addElement(constants.store.SECTION, {...data, id});

            if ((result instanceof Error)){
                throw result
            }
            return id
        },

        /**
         * возвращает элемент из бд
         * @param {string} id
         * @returns {Promise<SectionType|undefined>}
         */
        async get(id){
            return await db.getElement(constants.store.SECTION, id)
        },

        /**
         * Редактирует секцию в бд
         * @method
         * @name edit
         * @param {SectionType} data
         * @returns {Promise<string> | Promise<Error>}
         */
        async edit(data) {
            if (data.id && isValidData(data)) {
                const section = await db.getElement(constants.store.SECTION, data.id);
                if (!section) {
                    throw new Error(`[Section.edit] Section with id "${data.id}" is not exist`);
                }
                return db.addElement(constants.store.SECTION, {...section, ...data})
            }
            throw new Error(`[Section.edit] Data is not valid: ${JSON.stringify(data)}`);
        },

        /**
         * удаляет секцию из бд
         * @callback
         * @param {string} id
         * @returns {Promise<*>}
         */
        async remove(id) {
            return await db.removeElement(constants.store.SECTION, id);
        }
    };
}