import constants from "../db/constants";
import isString from "../../../utils/validation/isString";
import Section from "./SectionModel";

/**
 * @typedef {object} LimitType
 @property {string | number} id
 @property {string | number} section_id
 @property {number } personal
 @property {number} value >= 0
 *
 */

/**
 * @typedef {object} EditLimitType
 * @property {string | number} id
 * @property {string | number} section_id
 * @property {string } [title]
 * @property {number | boolean } [personal]
 * @property {number} [value] >= 0
 */

/**
 * @param {string | number} user_id
 * @param {import('./db').LocalDB} db
 * */
export default function (db, user_id) {
    return {
        /**
         * добавляет новый лимит в бд
         * @param {string} title
         * @param {number | boolean} personal
         * @param {string} color
         * @param {number} value
         * @returns {Promise<*>}
         */
        async add(title, personal, color, value) {
            const section_id = await Section(db, user_id).add({title, personal, color});
            if (section_id instanceof Error) {
                throw section_id;
            }

            const newLimit = {
                id: section_id,
                personal, value
            };

            const result = await db.addElement(constants.store.SECTION_LIMITS, newLimit);

            if ((result instanceof Error)) {
                throw result;
            }
            return id;
        },

        /**
         * возвращает элемент из бд
         * @param {string} id
         * @returns {Promise<*|undefined>}
         */
        async get(id) {
            return await db.getElement(constants.store.SECTION_LIMITS, id);
        },

        /**
         * Редактиркет существуюший лимит
         * @param {EditLimitType} data
         * @returns {Promise<boolean> | Promise<Error>}
         */
        async edit(data) {
            const {personal, title, value} = data;

            /**@type {LimitType}*/
            const limit = await db.getElement(constants.store.SECTION_LIMITS, data.id);
            let needUpdate = false;

            if (!limit) {
                throw new Error(`[Limit.edit] Limit with id "${data.id}" is not exist`);
            }
            if (personal) {
                limit.personal = !!personal ? 1 : 0;
                needUpdate = true;
            }
            if (value && isPositiveNumber(value)) {
                limit.value = value;
                needUpdate = true;
            }
            if (title && isString(title)) {
                const section = await Section(db, user_id).get(limit.section_id);
                if (section instanceof Error) {
                    throw new Error(`[Limit.edit] Section with id "${limit.section_id}" is not exist`);
                }
                const res = await Section(db, user_id).edit({...section, title});
                if (res instanceof Error) {
                    throw res;
                }
            }
            if (needUpdate) {
                await db.editElement(constants.store.SECTION_LIMITS, limit);
            }
            return true;
        },

        /**
         * Удаляет лимит из хранилища
         * @param {string | number} id
         * @returns {Promise<void>}
         */
        async remove(id) {
            return await db.removeElement(constants.store.SECTION_LIMITS, id);
        },
    };
}