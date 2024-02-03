import React, {createContext, useEffect, useState} from 'react'
import {Outlet, useParams} from "react-router-dom";

import defaultHandleError from "../../utils/error-handlers/defaultHandleError";
import {useAppContext, useUser} from "../AppContextProvider";
import {ExpenseService, LimitService} from "../../classes/services";
import {Expense, Limit} from "../../classes/StoreEntities";

import '../../modules/Expenses/css/Expenses.css'
import PageContainer from "../../components/PageContainer/PageContainer";
import Loader from "../../components/Loader/Loader";

export type ExpensesContextStateType = {
    actual: Expense[]
    plan: Expense[]
    limits: {
        common: Map<string, Limit>
        personal: Map<string, Limit>
    }
    loading: boolean
}

const initialValue: ExpensesContextStateType = {
    actual: [],
    plan: [],
    limits: {
        personal: new Map(),
        common: new Map()
    },
    loading: true
}

export const ExpensesContext = createContext<ExpensesContextStateType>(initialValue)
/**
 * обертка для молуля ExpensesActual
 * оборачивает в ExpensesContext
 */
export default function ExpensesContextProvider() {
    const user = useUser()!
    const context = useAppContext()
    const {travelCode} = useParams()
    const [state, setState] = useState<ExpensesContextStateType>(initialValue)


    useEffect(() => {
        if (!travelCode) return
        setState({...state, loading: true})
        const expensesPromise = ExpenseService.getAllByTravelId(context, travelCode)
        const limitsPromise = LimitService.getAllByTravelId(context, travelCode)
        Promise.all([expensesPromise, limitsPromise])
            .then(([expenses_list, limits_list]: [Expense[], Limit[]]) => {
                const actual: Expense[] = []
                const plan: Expense[] = []
                expenses_list.forEach(e => e.variant === "expenses_actual" ? actual.push(e) : plan.push(e))

                for (const limit of limits_list) {
                    if (limit.isPersonal(user))
                        state.limits.personal.set(limit.section_id, limit)
                    else
                        state.limits.common.set(limit.section_id, limit)
                }
                setState({...state, actual, plan})
            })
            .catch(defaultHandleError)
            .finally(() => setState(prev => ({...prev, loading: false})))
    }, [travelCode])


    if (state.loading) {
        return (
            <PageContainer center>
                <Loader className='loader'/>
            </PageContainer>
        )
    }


    return (
        <ExpensesContext.Provider value={state}>
            <Outlet/>
        </ExpensesContext.Provider>
    )
}



