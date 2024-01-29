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
            all: new Map(),
        },
        actual: {
            personal: new Map(),
            common: new Map(),
            all: new Map(),
        },
        group: true
    })

    useEffect(() => {
        if (expensesContext.loading) return
        if(!user) return

        const newState: ExpensesGroupsContextStateType = {...state,  group: false}

        //group plan expenses
        expensesContext.plan.forEach(e => {
            if(e.isPersonal(user)) {
                if(!newState.plan.personal.has(e.section_id))
                    newState.plan.personal.set(e.section_id, [])
                if(!newState.plan.all.has(e.section_id))
                    newState.plan.all.set(e.section_id, [])

                newState.plan.personal.get(e.section_id)!.push(e)
                newState.plan.all.get(e.section_id)!.push(e)
            } else {
                if(!newState.plan.common.has(e.section_id))
                    newState.plan.common.set(e.section_id, [])
                if(!newState.plan.all.has(e.section_id))
                    newState.plan.all.set(e.section_id, [])

                newState.plan.common.get(e.section_id)!.push(e)
                newState.plan.all.get(e.section_id)!.push(e)
            }
        })

        // group actual expenses
        expensesContext.actual.forEach(e => {
            if(e.isPersonal(user)) {
                if(!newState.actual.personal.has(e.section_id))
                    newState.actual.personal.set(e.section_id, [])
                if(!newState.actual.all.has(e.section_id))
                    newState.actual.all.set(e.section_id, [])

                newState.actual.personal.get(e.section_id)!.push(e)
                newState.actual.all.get(e.section_id)!.push(e)
            } else {
                if(!newState.actual.common.has(e.section_id))
                    newState.actual.common.set(e.section_id, [])
                if(!newState.actual.all.has(e.section_id))
                    newState.actual.all.set(e.section_id, [])

                newState.actual.common.get(e.section_id)!.push(e)
                newState.actual.all.get(e.section_id)!.push(e)
            }
        })
    }, [expensesContext, user])

    return [state, setState]
}