/**
 * @typedef SectionComponentDataType
 * @property {string} title
 * @property {ExpenseType[]} expenses
 * @property {number} limit
 * @property {number} total
 * @property {string} section_id
 */

import storeDB from "../../../db/storeDB/storeDB";
import constants from "../../../static/constants";

/**
 * @param {Travel} travel
 * @param {'actual' | 'planned'} type
 * @param {ExpenseFilterType} filter
 * @returns {Promise<SectionComponentDataType[]>}
 */
export default async function combineExpensesForSectionComponent(travel, type, filter,) {
    if (!travel) return []

    /**@type{Map<string, string>}*/
    const sectionMap = new Map();

    /**@type{SectionType[]}*/
    const sections = await storeDB.getAll(constants.store.SECTION)
    sections.map(s => sectionMap.set(s.id, s.title))

    /**@type{LimitType[]}*/
    const limits = await storeDB.getAllFromIndex(constants.store.LIMIT, constants.indexes.PRIMARY_ENTITY_ID, travel.id)

    /**@type{Map<string, LimitType[]>}*/
    const limitsMap = new Map()

    limits
        .forEach(l => {
            if (!limitsMap.has(l.section_id)) limitsMap.set(l.section_id, [])
            limitsMap.get(l.section_id).push(l)
        })


    const expenses = travel.expenses(type, filter)
    const expenseMap = getSectionsList(expenses, filter, travel.user_id)

    /**@type{SectionComponentDataType[]}*/
    const result = []

    /**
     * @param {LimitType[]} limits
     * @returns {number}
     */
    function exactLimit(limits) {
        if (!limits || !limits.length) return 0
        if (filter === 'All' || filter === 'Common') {
            const res = limits.find(l => l.personal === 0)
            return res?.value || 0
        } else if (filter === 'Personal') {
            const res = limits.find(l => l.personal === 1 && l.id.split(':').shift() === travel.user_id)
            return res?.value || 0
        }
    }

    for (const [section_id, expenses] of expenseMap.entries()) {
        result.push({
            expenses,
            limit: exactLimit(limitsMap.get(section_id)),
            title: sectionMap.get(section_id) || '',
            total: expenses.reduce((acc, e) => e.convertedValue + acc, 0) || 0,
            section_id,
        })
    }

    console.log(result)
    return result
}


/**
 * Хук возвращает сгрупированный список секция-расходы для выбранного фильтра
 * @function
 * @name getSectionsList
 * @param {Expense[]} expenses
 * @param {ExpenseFilterType} filter
 * @param {string} user_id
 * @returns {Map<string, Expense[]>}
 * @category Hooks
 */
function getSectionsList(expenses, filter, user_id) {
    /**@type {Map<string, ExpenseType[]>}*/
    const map = new Map()

    /**
     * @param {Map<string, ExpenseType[]>} map
     * @param {ExpenseType} expense
     */
    function addExpenseToMap(map, expense) {
        if (map.has(expense.section_id)) {
            map.get(expense.section_id).push(expense)
        } else {
            map.set(expense.section_id, [expense])
        }
    }

    expenses.forEach(e => addExpenseToMap(map, e))

    return map

}