import {useContext} from "react";
import {ExpensesGroupsContext} from "./ExpensesGroupsContextProvider";
import {ExpenseFilterType} from "../../types/filtersTypes";
import {Expense} from "../../classes/StoreEntities";

export function useExpensesGroupPlan(key: ExpenseFilterType): Map<string, Expense[]>{
    const context = useContext(ExpensesGroupsContext)
    console.log(context)
    switch (key){
        case "personal":
            return context.plan.personal
        case "common":
            return context.plan.common
        case "all":
            return new Map([...context.plan.personal.entries(), ...context.plan.common.entries()])
    }
}