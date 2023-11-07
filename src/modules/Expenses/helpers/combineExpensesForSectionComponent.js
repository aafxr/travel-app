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
import defaultUpdateTravelInfo from "../../../utils/defaultUpdateTravelInfo";

/**
 *
 * @param {string} storeName
 * @param {ExpenseFilterType} filter
 * @param {string} primary_entity_id
 * @param {string} user_id
 * @returns {Promise<SectionComponentDataType[]>}
 */
export default async function combineExpensesForSectionComponent(storeName, filter, primary_entity_id, user_id) {
    const isPersonal = filter === 'personal' ? 1 : 0
    const isActual = constants.store.EXPENSES_ACTUAL === storeName
    const isPlan = constants.store.EXPENSES_PLAN === storeName

    /**@type{Map<string,number>}*/
    const totalSectionMap = new Map()

    // /**@type{{common: TotalBySectionType, personal: TotalBySectionType}[]}*/
    // let list
    // if (isActual) {
    //     list = updatedTravelInfo.actual_list
    // } else if (isPlan) {
    //     list = updatedTravelInfo.planned_list
    // } else {
    //     console.error(new Error(`unknown value of prop storeName: ${storeName}`))
    //     return []
    // }

    // list.map(u =>
    //     isPersonal
    //         ? u.personal
    //         : u.common
    // ).forEach(u => totalSectionMap.set(u.section_id, u.total))

    /**@type{Map<string, string>}*/
    const sectionMap = new Map();

    /**@type{SectionType[]}*/
    const sections = await storeDB.getAll(constants.store.SECTION)
    sections.map(s => sectionMap.set(s.id, s.title))

    /**@type{LimitType[]}*/
    const limits = await storeDB.getAllFromIndex(constants.store.LIMIT, constants.indexes.PRIMARY_ENTITY_ID, primary_entity_id)

    /**@type{Map<string, LimitType[]>}*/
    const limitsMap = new Map()

    limits
        .forEach(l => {
            if(!limitsMap.has(l.section_id)) limitsMap.set(l.section_id, [])
            limitsMap.get(l.section_id).push(l)
        })


    const expenses = await storeDB.getAllFromIndex(storeName, constants.indexes.PRIMARY_ENTITY_ID, primary_entity_id)
    const expenseMap = getSectionsList(expenses, filter, user_id)

    /**@type{SectionComponentDataType[]}*/
    const result = []

    /**
     * @param {LimitType[]} limits
     * @returns {number}
     */
    function exactLimit(limits){
        if (!limits || !limits.length) return 0
        if(filter === 'All' || filter === 'Common'){
            const res = limits.find(l=> l.personal === 0)
            return res?.value || 0
        }else if(filter === 'Personal'){
            const res = limits.find(l=> l.personal === 1 && l.id.split(':').shift() === user_id)
            return res?.value || 0
        }
    }

    for (const [section_id, expenses] of expenseMap.entries()) {
        result.push({
            expenses,
            limit: exactLimit(limitsMap.get(section_id)),
            title: sectionMap.get(section_id) || '',
            total: totalSectionMap.get(section_id) || 0,
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
 * @param {ExpenseType[]} expenses
 * @param {ExpenseFilterType} filter
 * @param {string} user_id
 * @returns {Map<string, ExpenseType[]>}
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
        }
        else {
            map.set(expense.section_id, [expense])
        }
    }

    if (filter === "All") {
        expenses.forEach(e => addExpenseToMap(map, e))
    } else if (filter === "Common") {
        expenses.forEach(e => e.personal === 0 && addExpenseToMap(map, e))
    } else if (filter === "Personal") {
        expenses.forEach(e => e.personal === 1 && e.user_id === user_id && addExpenseToMap(map, e))
    }

    return map

}