import {useContext} from "react";
import {ExpensesGroupsContext} from "./ExpensesGroupsContextProvider";
import {ExpenseFilterType} from "../../types/filtersTypes";

export function useExpensesGroupPlan(key: ExpenseFilterType){
    const context = useContext(ExpensesGroupsContext)
    switch (key){
        case "personal":
            return context.plan.personal
        case "common":
            return context.plan.common
        case "all":
            return [...context.plan.personal, ...context.plan.common]
        default:
            return []
    }
}