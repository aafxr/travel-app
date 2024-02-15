import React, {useContext, useEffect, useState} from "react";

import {ExpensesGroupsContextStateType} from "./ExpensesGroupsContextProvider";
import {ExpensesContext} from "./ExpensesContextProvider";
import {useUser} from "../AppContextProvider";
import {Expense} from "../../classes/StoreEntities";

export  function useGroupExpensesState():[ExpensesGroupsContextStateType,  React.Dispatch<React.SetStateAction<ExpensesGroupsContextStateType>>]{
    const expensesContext = useContext(ExpensesContext)
    const user = useUser()
    const [state, setState] = useState<ExpensesGroupsContextStateType>({
        plan: {
            personal: new Map(),
            common: new Map(),
        },
        actual: {
            personal: new Map(),
            common: new Map(),
        }
    })

    useEffect(() => {
        if (expensesContext.loading) return
        if(!user) return

        const newState: ExpensesGroupsContextStateType = {actual:{...state.actual}, plan:{...state.plan}}

        newState.plan.common.clear()
        newState.plan.personal.clear()

        //group plan expenses
        expensesContext.plan.forEach(e => {
            if(Expense.isPersonal(e, user)) {
                if(!newState.plan.personal.has(e.section_id))
                    newState.plan.personal.set(e.section_id, [])
                newState.plan.personal.get(e.section_id)!.push(e)
            } else {
                if(!newState.plan.common.has(e.section_id))
                    newState.plan.common.set(e.section_id, [])
                newState.plan.common.get(e.section_id)!.push(e)
            }
        })
        setState(newState)
    }, [expensesContext.plan, user])


    useEffect(() => {
        if(!user) return
        if (expensesContext.loading) return

        const newState: ExpensesGroupsContextStateType = {actual:{...state.actual}, plan:{...state.plan}}

        newState.actual.common.clear()
        newState.actual.personal.clear()

        // group actual expenses
        expensesContext.actual.forEach(e => {
            if(Expense.isPersonal(e, user)) {
                if(!newState.actual.personal.has(e.section_id))
                    newState.actual.personal.set(e.section_id, [])
                newState.actual.personal.get(e.section_id)!.push(e)
            } else {
                if(!newState.actual.common.has(e.section_id))
                    newState.actual.common.set(e.section_id, [])
                newState.actual.common.get(e.section_id)!.push(e)
            }
        })
        setState(newState)
    }, [expensesContext.actual, user])

    return [state, setState]
}