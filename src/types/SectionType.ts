/**
 * @name SectionType
 * @typedef {object} SectionType
 * @property {string} id id секции
 * @property {string} title название секции
 * @property {string} color цвет секции
 * @property {DBFlagType} hidden
 * @category Types
 */
import {DBFlagType} from "./DBFlagType";

export interface SectionType{
    id: string
    title: string
    color: string
    hidden: DBFlagType
}
