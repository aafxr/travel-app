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

    /**@type{UpdateTravelInfoType}*/
    const updatedTravelInfo = await storeDB
            .getOne(constants.store.UPDATED_TRAVEL_INFO, primary_entity_id)
        || defaultUpdateTravelInfo(primary_entity_id)

    /**@type{Map<string,number>}*/
    const totalSectionMap = new Map()

    /**@type{{common: TotalBySectionType, personal: TotalBySectionType}[]}*/
    let list
    if (isActual) {
        list = updatedTravelInfo.actual_list
    } else if (isPlan) {
        list = updatedTravelInfo.planned_list
    } else {
        console.error(new Error(`unknown value of prop storeName: ${storeName}`))
        return []
    }

    list.map(u =>
        isPersonal
            ? u.personal
            : u.common
    ).forEach(u => totalSectionMap.set(u.section_id, u.total))

    /**@type{Map<string, string>}*/
    const sectionMap = new Map();

    /**@type{SectionType[]}*/
    const sections = await storeDB.getAll(constants.store.SECTION)
    sections.map(s => sectionMap.set(s.id, s.title))

    /**@type{LimitType[]}*/
    const limits = await storeDB.getAllFromIndex(constants.store.LIMIT, constants.indexes.PRIMARY_ENTITY_ID, primary_entity_id)

    /**@type{Map<string, LimitType>}*/
    const limitsMap = new Map()

    limits
        .filter(l => l.personal === isPersonal)
        .forEach(l => limitsMap.set(l.section_id, l))


    const expenses = await storeDB.getAllFromIndex(storeName, constants.indexes.PRIMARY_ENTITY_ID, primary_entity_id)
    const expenseMap = getSectionsList(expenses, filter)

    /**@type{SectionComponentDataType[]}*/
    const result = []

    for (const [section_id, expenses] of expenseMap.entries()) {
        result.push({
            expenses,
            limit: limitsMap.get(section_id)?.value || 0,
            title: sectionMap.get(section_id) || '',
            total: totalSectionMap.get(section_id) || 0,
            section_id,
        })
    }

    return result
}


/**
 * Хук возвращает сгрупированный список секция-расходы для выбранного фильтра
 * @function
 * @name getSectionsList
 * @param {ExpenseType[]} expenses
 * @param {ExpenseFilterType} filter
 * @returns {Map<string, ExpenseType[]>}
 * @category Hooks
 */
function getSectionsList(expenses, filter) {
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
    } else if (filter === "personal") {
        expenses.forEach(e => e.personal === 1 && addExpenseToMap(map, e))
    }

    return map

}