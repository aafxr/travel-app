import {useContext} from "react";
import {ExpensesGroupsContext} from "./ExpensesGroupsContextProvider";
import {ExpenseFilterType} from "../../types/filtersTypes";

export function useExpensesGroupActual(key: ExpenseFilterType){
    const context = useContext(ExpensesGroupsContext)
    return context.actual[key]
}
