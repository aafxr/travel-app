import React, {createContext, useEffect, useState} from 'react'
import {Outlet, useParams} from "react-router-dom";

import defaultHandleError from "../../utils/error-handlers/defaultHandleError";
import {ExpenseService, LimitService} from "../../classes/services";
import {Expense, Limit} from "../../classes/StoreEntities";
import {useAppContext} from "../AppContextProvider";

import '../../modules/Expenses/css/Expenses.css'
import PageContainer from "../../components/PageContainer/PageContainer";
import Loader from "../../components/Loader/Loader";

export type ExpensesContextStateType = {
    actual: Expense[]
    plan: Expense[]
    limits: Map<string, Limit>
    loading: boolean
    removeExpense?: (e:Expense) => unknown
}

const initialValue: ExpensesContextStateType = {
    actual: [],
    plan: [],
    limits: new Map(),
    loading: true
}

export const ExpensesContext = createContext<ExpensesContextStateType>(initialValue)
/**
 * обертка для молуля ExpensesActual
 * оборачивает в ExpensesContext
 */
export default function ExpensesContextProvider() {
    const context = useAppContext()
    const {travelCode} = useParams()
    const [state, setState] = useState<ExpensesContextStateType>(initialValue)


    useEffect(() => {
        if (!travelCode) return
        setState({...state, loading: true})
        const expensesPromise = ExpenseService.getAllByTravelId(context, travelCode)
            .then((expenses_list) => {
                const actual: Expense[] = []
                const plan: Expense[] = []
                expenses_list.forEach(e => e.variant === "expenses_actual" ? actual.push(e) : plan.push(e))
                setState({...state, actual, plan})
            })
            .catch(defaultHandleError)


        const limitsPromise = LimitService.getAllByTravelId(context, travelCode)
            .then(limits_list => {
                for (const limit of limits_list) {
                    state.limits.set(limit.id, limit)
                }
            })
            .catch(defaultHandleError)


        Promise.all([expensesPromise, limitsPromise])
            .finally(() => setState(prev => ({...prev, loading: false})))


    }, [travelCode])

    function handleRemoveExpense(e:Expense){
        if(e.variant === 'expenses_actual'){
            const update = state.actual.filter(exp => exp !== e)
            setState(prev => ({...prev, actual: update}))
        }else if(e.variant === 'expenses_plan'){
            const update = state.plan.filter(exp => exp !== e)
            setState(prev => ({...prev, plan: update}))
        }
    }

    state.removeExpense = handleRemoveExpense


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



