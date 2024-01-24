/**
 * Тип описывает сущность "расходы"
 * @name ExpenseType
 * @typedef {object} ExpenseType
 * @property {string}   id id расхода
 * @property {string}   user_id id пользователя, добавившего новую запись о расходе
 * @property {string}   primary_entity_type тип основной сущноости
 * @property {string}   primary_entity_id id путешествия, во время которого создана запись о расходе
 * @property {string}   entity_type
 * @property {string}   entity_id
 * @property {string}   title название расхода
 * @property {number}   value \>=0, сумма расхода
 * @property {1 | 0}    personal флаг личный / общий расход
 * @property {string}   section_id  id секции, в рамках которой создан расход
 * @property {Date}     datetime время,когда расход был осуществлен
 * @property {Date}     created_at дата создания записи о расходе
 * @property {string}   currency символ валуты
 * @category Types
 */
import {DBFlagType} from "./DBFlagType";
import {CurrencyName} from "./CurrencyName";

export type ExpenseVariantType = 'expenses_actual' | 'expenses_plan'

export interface ExpenseType{
    id: string
    user_id: string
    primary_entity_type: string
    primary_entity_id: string
    entity_type: string
    entity_id: string
    title: string
    value: number
    personal: DBFlagType
    section_id: string
    datetime: Date
    created_at: Date
    currency: CurrencyName
    variant: ExpenseVariantType
}
