import {ExpensesContext, ExpensesContextStateType} from "./ExpensesContextProvider";
import {useContext} from "react";

export function useExpenses<T extends keyof Omit<ExpensesContextStateType, 'loading'>>(key: T): ExpensesContextStateType[T]{
    const context = useContext(ExpensesContext)
    return context[key]
}