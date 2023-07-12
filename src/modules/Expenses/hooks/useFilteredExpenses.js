import {useMemo} from "react";
import distinctValues from "../../../utils/distinctValues";



export default function useFilteredExpenses(expenses, limits, sections, filter, user_id){
    const filteredExpenses = useMemo(() => {
        if (filter === 'personal') {
            return expenses.filter(e => e.user_id === user_id && e.personal === 1)
        } else if (filter === 'common') {
            return expenses.filter(e => e.personal === 0)
        } else {
            return expenses
        }
    }, [expenses, filter])


    const sectionList = distinctValues(filteredExpenses, exp => exp.section_id)

    const limitsList = useMemo(function (){
        if (filter === 'personal') {
            return limits
                .filter(l =>  l.user_id === user_id && l.personal === 1 )
                .filter(l => sectionList.includes(l.section_id))
        } else if (filter === 'common'){
            return limits
                .filter(l => l.personal === 0 )
                .filter(l => sectionList.includes(l.section_id))
        } else {
            return []
        }
    }, [limits, filter])

    return {
        filteredExpenses,
        sectionList,
        limitsList
    }
}