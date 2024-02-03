import {useContext} from "react";

import {ExpensesContext} from "./ExpensesContextProvider";
import {ExpenseFilterType} from "../../types/filtersTypes";

export function useLimit(section_id: string, expensesFilter: ExpenseFilterType | undefined) {
    const expenseContext = useContext(ExpensesContext)

    switch (expensesFilter) {
        case "personal":
            return expenseContext.limits.personal.get(section_id)
        case "common":
            return expenseContext.limits.common.get(section_id)
        case "all":
            return expenseContext.limits.common.get(section_id)
    }
}