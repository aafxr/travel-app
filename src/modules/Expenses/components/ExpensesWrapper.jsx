import React, {useContext} from 'react'
import {Outlet, useParams} from "react-router-dom";

import {WorkerContext} from "../../../contexts/WorkerContextProvider";
import useUserSelector from "../../../hooks/useUserSelector";
import usePostMessage from "../hooks/usePostMessage";

import '../css/Expenses.css'

/**
 * @typedef {Object} DispatchType
 * @property {DispatchFunction} dispatch
 */


/**
 * обертка для молуля Expenses
 *
 * оборачивает в ExpensesContext
 * @returns {JSX.Element}
 * @constructor
 */
export default function ExpensesWrapper() {
    const {travelCode: primary_entity_id} = useParams()
    const {worker} = useContext(WorkerContext)
    const user = useUserSelector()
    const user_id = user.id

    // useDefaultSection(primary_entity_id, user_id)

    usePostMessage(worker, primary_entity_id)

    // useEffect(() => {
    //     function handleMessage(action){
    //         switch (action.type){
    //             case constants.store.EXPENSES_ACTUAL:
    //                 storeDB.getManyFromIndex(constants.store.EXPENSES_ACTUAL, primary_entity_id)
    //                     .then(items => dispatch(actions.expensesActions.setExpensesActual(items)))
    //                 break;
    //             case constants.store.EXPENSES_PLAN:
    //                 storeDB.getManyFromIndex(constants.store.EXPENSES_PLAN, primary_entity_id)
    //                     .then(items => dispatch(actions.expensesActions.setExpensesPlan(items)))
    //                 break;
    //             case constants.store.LIMIT:
    //                 storeDB.getManyFromIndex(constants.store.LIMIT, primary_entity_id)
    //                     .then(items => dispatch(actions.expensesActions.setExpensesLimit(items)))
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    //     if (worker){
    //         worker.addEventListener('message', handleMessage)
    //     }
    //
    //     return () => worker.removeEventListener('message', handleMessage)
    // },[])

    // console.log(state)
    // useEffect(() => {
    //     updateCurrency(dispatch)
    // }, [])

    // useEffect(() => {
    //     dispatch(initExpensesThunk(primary_entity_id))
    // }, [dispatch])

    // useEffect(() => {
    //     if (sections && sections.length) {
    //         const section = sections.find(s => s.title === 'Прочие расходы')
    //         const defaultSection = section ? section : null
    //         dispatch(actions.expensesActions.setDefaultSection(defaultSection))
    //     }
    // }, [sections])


    return <Outlet/>
}



