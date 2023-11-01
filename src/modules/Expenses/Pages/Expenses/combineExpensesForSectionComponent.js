/**
 * @typedef SectionComponentDataType
 * @property {string} title
 * @property {ExpenseType[]} expenses
 * @property {number} limit
 * @property {number} total
 * @property {string} section_id
 */

import storeDB from "../../../../db/storeDB/storeDB";
import constants from "../../../../static/constants";
import defaultUpdateTravelInfo from "../../../../utils/defaultUpdateTravelInfo";

/**
 *
 * @param {string} storeName
 * @param {ExpenseFilterType} filter
 * @param {string} primary_entity_id
 * @returns {Promise<SectionComponentDataType[]>}
 */
export default async function combineExpensesForSectionComponent(storeName, filter, primary_entity_id) {
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

    list.map(a =>
        isPersonal
            ? a.personal
            : a.common
    ).forEach(a => totalSectionMap.set(a.section_id, a.total))

    /**@type{Map<string, SectionType>}*/
    const sectionMap = new Map();
    (await storeDB.getAll(constants.store.SECTION))
        .map(s => sectionMap.set(s.title, s))

    /**@type{LimitType[]}*/
    const limits = await storeDB.getAllFromIndex(constants.store.LIMIT, constants.indexes.PRIMARY_ENTITY_ID, primary_entity_id)
    /**@type{Map<string, LimitType>}*/
    const limitsMap = new Map()
    limits
        .filter(l => l.personal === isPersonal)
        .forEach(l => limitsMap.set(l.section_id, l))

    // const sections = await

    const expenses = await storeDB.getAllFromIndex(storeName, constants.indexes.PRIMARY_ENTITY_ID, primary_entity_id)
    const expenseMap = getSectionsList(expenses, updatedTravelInfo, filter)
    console.log({expenses, updatedTravelInfo, filter})
    /**@type{SectionComponentDataType[]}*/
    const result = []

    for (const [section_id, expenses] of expenseMap.entries()) {
        result.push({
            expenses,
            limit: limitsMap.get(section_id) || 0,
            title: sectionMap.get(section_id) || '',
            total: totalSectionMap.get(section_id) || 0,
            section_id,
        })
    }


    console.log({
        limitsMap,
        sectionMap,
        totalSectionMap,
    })
    return result
}


/**
 * Хук возвращает сгрупированный список секция-расходы для выбранного фильтра
 * @function
 * @name getSectionsList
 * @param {ExpenseType[]} expenses
 * @param {UpdateTravelInfoType} updateTravelInfo
 * @param {ExpenseFilterType} filter
 * @returns {Map<string, ExpenseType[]>}
 * @category Hooks
 */
function getSectionsList(expenses, updateTravelInfo, filter) {
    /**@type {Map<string, ExpenseType[]>}*/
    const map = new Map()

    if (!updateTravelInfo) return map
    let sectionList
    if (filter === "All") {
        sectionList = updateTravelInfo.actual_list
            .map(e => e.common.section_id)
    } else if (filter === "Common") {
        sectionList = updateTravelInfo.actual_list
            .filter(e => e.common.total > 0)
            .map(e => e.common.section_id)
    } else if (filter === "personal") {
        sectionList = updateTravelInfo.actual_list
            .filter(e => e.personal.total > 0)
            .map(e => e.personal.section_id)
    } else {
        console.warn(`unknown filter type: "${filter}"`)
        sectionList = []
    }


    sectionList.forEach(s => map.set(s, []))
    if (filter === "All") {
        expenses.forEach(e => map.has(e.section_id) && map.get(e.section_id).push(e))
    } else if (filter === "Common") {
        expenses.forEach(e => map.has(e.section_id) && e.personal === 0 && map.get(e.section_id).push(e))
    } else if (filter === "personal") {
        expenses.forEach(e => map.has(e.section_id) && e.personal === 1 && map.get(e.section_id).push(e))
    }

    return map

}