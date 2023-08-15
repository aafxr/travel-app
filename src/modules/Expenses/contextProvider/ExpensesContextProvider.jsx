import React, {createContext, useContext, useEffect, useReducer, useState} from 'react'
import {Outlet, useParams} from "react-router-dom";

import {WorkerContext} from "../../../contexts/WorkerContextProvider";

import useDefaultSection from "../hooks/useDefaultSections";
import updateCurrency from "../helpers/updateCurrency";

import updateSections from "../helpers/updateSections";
import {updateLimits} from "../helpers/updateLimits";
import functionDurationTest from "../../../utils/functionDurationTest";

import constants, {reducerConstants} from "../../../static/constants";

import sendActionToWorker from "../../../utils/sendActionToWorker";
import usePostMessage from "../hooks/usePostMessage";
import {UserContext} from "../../../contexts/UserContextProvider.jsx";
import '../css/Expenses.css'
import expensesController from "../controllers/expensesController";
import expensesReducer from "./reducer";
import updateExpenses from "../helpers/updateExpenses";
import errorReport from "../../../controllers/ErrorReport";

/**
 * @typedef {Object} DispatchType
 * @property {DispatchFunction} dispatch
 */

/**
 * предоставляет доступ к контроллеру модуля Expenses
 * @type {React.Context<ExpensesReducerState & DispatchType| null>}
 */
export const ExpensesContext = createContext(null)


/**
 * @type ExpensesReducerState
 */
const defaultState = {
    controller: null,
    defaultSection: null,
    limits: [],
    sections: [],
    expensesActual: [],
    expensesPlan: [],
    currency: [],
}

/**
 * обертка для молуля Expenses
 *
 * оборачивает в ExpensesContext
 * @returns {JSX.Element}
 * @constructor
 */
export default function ExpensesContextProvider() {
    const {travelCode: primary_entity_id} = useParams()
    const [dbReady, setDbReady] = useState(false)
    /**@type{[ExpensesReducerState, DispatchFunction]}*/
    const [state, dispatch] = useReducer(expensesReducer, defaultState, () => defaultState)

    const {worker} = useContext(WorkerContext)


    const [onSendSet, setOnSendSet] = useState(false)

    const {user} = useContext(UserContext)

    const user_id = user.id

    useDefaultSection(state.controller, dispatch, primary_entity_id, user_id)

    usePostMessage(worker, primary_entity_id)

    // console.log(state)

    useEffect(() => {
        const controller = expensesController
        controller.onReady = () => setDbReady(true)
        dispatch({type: reducerConstants.UPDATE_CONTROLLER, payload: controller})

        async function init(){
            await updateSections(controller).then(items => dispatch({
                type: reducerConstants.UPDATE_EXPENSES_SECTIONS,
                payload: items
            }))

            await updateCurrency(dispatch)

            await updateExpenses(controller, primary_entity_id, 'actual').then(items => dispatch({
                type: reducerConstants.UPDATE_EXPENSES_ACTUAL,
                payload: items
            }))

            await updateExpenses(controller, primary_entity_id, 'plan').then(items => dispatch({
                type: reducerConstants.UPDATE_EXPENSES_PLAN,
                payload: items
            }))

            await updateLimits(primary_entity_id, user_id, state.currency)(state.controller).then(items => dispatch({
                    type: reducerConstants.UPDATE_EXPENSES_LIMIT,
                    payload: items
                })
            )
        }

        init().catch(err => errorReport.sendError(err))
    }, [])

    useEffect(() => {
        if (worker && state.controller) {
            async function workerMessageHandler(e) {
                const {type, data: actions} = e.data
                if (state.controller) {
                    console.log('workerMessageHandler: ', e.data)
                    functionDurationTest(state.controller.actionHandler.bind(state.controller, actions), '[Основной поток] Время обработки actions: ')
                    !state.sections.length && (await updateSections(state.controller))
                        .then(items => dispatch({type: reducerConstants.UPDATE_EXPENSES_SECTIONS, payload: items}))
                }
            }

            worker.addEventListener('message', workerMessageHandler)
            return () => worker && worker.removeEventListener('message', workerMessageHandler)
        }
    }, [state.controller, worker])

    useEffect(() => {
        if (state.controller && worker && !onSendSet) {
            state.controller.onSendData = sendActionToWorker(worker, constants.store.EXPENSES_ACTIONS)
            setOnSendSet(true)
        }
    }, [state.controller, worker, onSendSet])


    useEffect(() => {
        const sections = state.sections
        if (sections && sections.length) {
            const section = sections.find(s => s.title === 'Прочие расходы')
            const defaultSection = section ? section : null
            dispatch({type: reducerConstants.UPDATE_EXPENSES_DEFAULT_SECTION, payload: defaultSection})
        }
    }, [state.sections])

    if (!dbReady) {
        return null
    }

    return (
        <ExpensesContext.Provider value={{dispatch, ...state}}>
            <Outlet/>
        </ExpensesContext.Provider>
    )
}
