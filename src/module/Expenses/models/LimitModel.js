import constants from "../db/constants";
import isString from "../../../utils/validation/isString";
import Section from "./SectionModel";
import throwIfError from "../../../utils/throwIfError";

/**
 * @typedef {object} LimitType
 @property {string | number} id
 @property {string | number} section_id
 @property {number } personal
 @property {number} value >= 0
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
 * @typedef {object} SectionDescriptionType
 @property {string } title
 @property {number} value >= 0
 */

/**
 * @typedef {import('./SectionType').SectionType} SectionType
 */

/**
 * возвращает методы для работы с LimitType (лимит расходов на категорию)
 * @param {string | number} user_id
 * @param {import('./db').LocalDB} db
 */
export default function (db, user_id) {
    const storeName = storeName
    return {
        /**
         * добавляет новый лимит в бд
         * @param {string} title
         * @param {number | boolean} personal
         * @param {string} color
         * @param {string} primary_entity_id
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

            const result = await db.addElement(storeName, newLimit);

            if ((result instanceof Error)) {
                throw result;
            }
            return section_id;
        },

        /**
         * возвращает элемент из бд
         * @param {string | number | IDBKeyRange} query
         * @returns {Promise<*|undefined>}
         */
        async get(query) {
            return await db.getElement(storeName, query);
        },

        /**
         *
         * @param id
         * @returns {Promise<SectionDescriptionType | undefined>}
         */
        async getLimitWithSection(id){
            const limit = await db.getFromIndex(storeName,constants.indexes.SECTION_ID, id)
            const section = await Section(db, user_id).get(limit.section_id)

            return {
                title: section.title,
                value: limit.value
            }
        },

        /**
         * Редактиркет существуюший лимит
         * @param {EditLimitType} data
         * @returns {Promise<boolean> | Promise<Error>}
         */
        async edit(data) {
            const {personal, title, value} = data;

            /**@type {LimitType}*/
            const limit = await db.getElement(storeName, data.id);
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
                /**@type {SectionType}*/
                const section = await Section(db, user_id).get(limit.section_id);
                if (section instanceof Error) {
                    throw new Error(`[Limit.edit] Section with id "${limit.section_id}" is not exist`);
                }
                const res = await Section(db, user_id).edit({...section, title});
                throwIfError(res)
            }
            if (needUpdate) {
                await db.editElement(storeName, limit);
            }
            return true;
        },

        /**
         * Удаляет лимит из хранилища
         * @param {string | number} id
         * @returns {Promise<void>}
         */
        async remove(id) {
            return await db.removeElement(storeName, id);
        },
    };
}