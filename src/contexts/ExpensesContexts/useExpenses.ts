import {ExpensesContext, ExpensesWrapperStateType} from "./ExpensesContextProvider";
import {useContext} from "react";

export function useExpenses<T extends keyof Omit<ExpensesWrapperStateType, 'loading'>>(key: T): ExpensesWrapperStateType[T]{
    const context = useContext(ExpensesContext)
    return context[key]
}