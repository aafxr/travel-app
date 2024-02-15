import {useContext} from "react";
import {ExpensesGroupsContext} from "./ExpensesGroupsContextProvider";
import {ExpenseFilterType} from "../../types/filtersTypes";
import {Expense} from "../../classes/StoreEntities";

export function useExpensesGroupActual(key: ExpenseFilterType): Map<string, Expense[]> {
    const context = useContext(ExpensesGroupsContext)

    switch (key) {
        case "personal":
            return context.actual.personal
        case "common":
            return context.actual.common
        case "all":
            return new Map<string, Expense[]>([...context.actual.personal.entries(), ...context.actual.common.entries()])
        default:
            return new Map()
    }
}
