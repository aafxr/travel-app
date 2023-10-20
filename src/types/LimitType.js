/**
 * @name LimitType
 * @typedef {object} LimitType
 * @property {string} id id лимита
 * @property {string} section_id id секции, для которой учтановлен лимит
 * @property {DBFlagType} personal флаг личный / общий лимит
 * @property {number} value \>= 0, значение установленного лимита
 * @category Types
 */

/**
 * @typedef {object} EditLimitType
 * @property {string | number} id
 * @property {string | number} section_id
 * @property {string } [title]
 * @property {number | boolean } [personal]
 * @property {number} [value] \>= 0
 */
