import React, {useContext, useEffect, useState} from "react";

import {ExpensesGroupsContextStateType} from "./ExpensesGroupsContextProvider";
import {ExpensesContext} from "./ExpensesContextProvider";
import {useUser} from "../AppContextProvider";

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

        const newState: ExpensesGroupsContextStateType = {...state}

        //group plan expenses
        expensesContext.plan.forEach(e => {
            if(e.isPersonal(user)) {
                if(!newState.plan.personal.has(e.section_id))
                    newState.plan.personal.set(e.section_id, [])
                newState.plan.personal.get(e.section_id)!.push(e)
            } else {
                if(!newState.plan.common.has(e.section_id))
                    newState.plan.common.set(e.section_id, [])
                newState.plan.common.get(e.section_id)!.push(e)
            }
        })

        // group actual expenses
        expensesContext.actual.forEach(e => {
            if(e.isPersonal(user)) {
                if(!newState.actual.personal.has(e.section_id))
                    newState.actual.personal.set(e.section_id, [])
                newState.actual.personal.get(e.section_id)!.push(e)
            } else {
                if(!newState.actual.common.has(e.section_id))
                    newState.actual.common.set(e.section_id, [])
                newState.actual.common.get(e.section_id)!.push(e)
            }
        })
    }, [expensesContext, user])

    return [state, setState]
}