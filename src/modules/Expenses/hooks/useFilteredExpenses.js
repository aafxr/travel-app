import {useMemo} from "react";
import distinctValues from "../../../utils/distinctValues";


/**
 * метод отфильтровывает расходы и оставляет только соответствующие фильтру
 * @param {ExpenseType[]} expenses
 * @param {LimitType[]} limits
 * @param {ExpenseFilterType} filter
 * @param {string} user_id
 * @returns {{limitsList: LimitType[], filteredExpenses: ExpenseType[], sectionList: string[]}}
 */
export default function useFilteredExpenses(expenses, limits, filter, user_id){
    const filteredExpenses = useMemo(() => {
        if (!expenses || !expenses.length){
            return []
        }
        if (filter === 'personal') {
            return expenses.filter(e => e.user_id === user_id && e.personal === 1)
        } else if (filter === 'common') {
            return expenses.filter(e => e.personal === 0)
        } else if (filter === 'all') {
            return expenses.filter(e => e.personal === 0 || e.user_id === user_id)
        }
    }, [expenses, filter])


    const sectionList = distinctValues(filteredExpenses, exp => exp.section_id)

    const limitsList = useMemo(function (){
        if (!expenses || !expenses.length){
            return []
        }
        if (filter === 'personal') {
            return limits
                .filter(l =>  l.user_id === user_id && l.personal === 1 )
                .filter(l => sectionList.includes(l.section_id))
        } else if (filter === 'common'){
            return limits
                .filter(l => l.personal === 0 )
                .filter(l => sectionList.includes(l.section_id))
        } else {
            return limits
        }
    }, [limits, filter, expenses])

    return {
        filteredExpenses,
        sectionList,
        limitsList
    }
}