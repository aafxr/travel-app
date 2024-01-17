/**
 * @name LimitType
 * @typedef {object} LimitType
 * @property {string} id id лимита
 * @property {string} section_id id секции, для которой учтановлен лимит
 * @property {string} primary_entity_id id путешествия, для которой учтановлен лимит
 * @property {DBFlagType} personal флаг личный / общий лимит
 * @property {number} value \>= 0, значение установленного лимита
 * @category Types
 */

import {DBFlagType} from "./DBFlagType";

/**
 * @typedef {object} EditLimitType
 * @property {string | number} id
 * @property {string | number} section_id
 * @property {string } [title]
 * @property {number | boolean } [personal]
 * @property {number} [value] \>= 0
 */


export interface LimitType{
    id: string
    value: number
    personal: DBFlagType
    section_id: string
}