import {useMemo} from "react";

/**
 * Хук возвращает сгрупированный список секция-расходы для выбранного фильтра
 * @function
 * @name useSectionsList
 * @param {ExpenseType[]} expenses
 * @param {UpdateTravelInfoType} updateTravelInfo
 * @param {ExpenseFilterType} filter
 * @returns {Map<string, ExpenseType[]>}
 * @category Hooks
 */
export default function useSectionsList(expenses, updateTravelInfo, filter) {
    return useMemo(() => {
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
    }, [updateTravelInfo, filter])
}
