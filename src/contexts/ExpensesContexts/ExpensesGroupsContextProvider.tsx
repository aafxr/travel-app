import React, {createContext} from 'react'
import {Outlet, useLocation, useParams} from "react-router-dom";

import {useGroupExpensesState} from "./useGroupExpensesState";
import Container from "../../components/Container/Container";
import {PageHeader, Tab} from "../../components/ui";
import {Expense} from "../../classes/StoreEntities";

export type ExpensesGroupsContextStateType = {
    plan: {
        personal: Map<string, Expense[]>
        common: Map<string, Expense[]>
    },
    actual: {
        personal: Map<string, Expense[]>
        common: Map<string, Expense[]>
    },
}

export const ExpensesGroupsContext = createContext<ExpensesGroupsContextStateType>({
    plan: {
        personal: new Map(),
        common: new Map(),
    },
    actual: {
        personal: new Map(),
        common: new Map(),
    },
})

/**
 * обертка для расходов текущих и в планах
 *
 * добовляет табы и заголовок к странице
 */
export default function ExpensesGroupsContextProvider() {
    const [state] = useGroupExpensesState()

    const {travelCode} = useParams()
    const {pathname} = useLocation()

    const title = pathname.endsWith('plan/') ? 'Планы' : 'Текущие расходы'


    return (
        <div className='expenses-wrapper wrapper'>
            <Container>
                <PageHeader arrowBack title={title} to={`/travel/${travelCode}/`}/>
            </Container>
            <div className='flex-stretch'>
                <Tab name={'Расходы'} to={`/travel/${travelCode}/expenses/`}/>
                <Tab name={'Планы'} to={`/travel/${travelCode}/expenses/plan/`}/>
            </div>
            <ExpensesGroupsContext.Provider value={state}>
                <Outlet/>
            </ExpensesGroupsContext.Provider>
        </div>
    )
}