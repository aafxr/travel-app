import React, {createContext, useContext, useEffect, useState} from 'react'
import {Outlet, useParams} from "react-router-dom";

import ActionController from "../../../controllers/ActionController";

import {WorkerContext} from "../../../contexts/WorkerContextProvider";

import useDefaultSection from "../hooks/useDefaultSections";
import useCurrency from "../hooks/useCurrency";

import toArray from "../../../utils/toArray";
import {onUpdate} from "../controllers/onUpdate";
import updateSections from "../helpers/updateSections";
import updateLimits from "../helpers/updateLimits";
import functionDurationTest from "../../../utils/functionDurationTest";

import options from '../controllers/controllerOptions'
import constants from "../db/constants";
import schema from "../db/schema";

import '../css/Expenses.css'
import sendActionToWorker from "../../../utils/sendActionToWorker";
import usePostMessage from "../hooks/usePostMessage";


/**
 * предоставляет доступ к контроллеру модуля Expenses
 * @type {React.Context<null>}
 */
export const ExpensesContext = createContext(null)


/**
 * @typedef {Object} ExpensesContextState
 * @property {ActionController | null} controller
 * @property {import('../models/SectionType').SectionType | null} defaultSection
 * @property {Array.<import('../models/SectionType').SectionType> | []} sections
 * @property {Array.<import('../models/LimitType').LimitType> | []} limits
 */

/**
 * @type ExpensesContextState
 */
const defaultState = {
    controller: null,
    defaultSection: null,
    limits: [],
    sections: []
}

/**
 * обертка для молуля Expenses
 *
 * оборачивает в ExpensesContext
 * @param {string} user_id
 * @returns {JSX.Element}
 * @constructor
 */
export default function ExpensesContextProvider({user_id}) {
    const {travelCode: primary_entity_id} = useParams()
    const [dbReady, setDbReady] = useState(false)
    /**  @type {[ExpensesContextState, function]} */
    const [state, setState] = useState( defaultState)

    const [sections, setSections] = useState([])
    const [limits, setLimits] = useState([])

    const {worker} = useContext(WorkerContext)

    const currency = useCurrency()

    useDefaultSection(state.controller, primary_entity_id, user_id)

    usePostMessage(worker, primary_entity_id)


    useEffect(() => {
        const controller = new ActionController(schema, {
            ...options,
            onReady: () => setDbReady(true),
            onError: console.error
        })
        controller.onUpdate = onUpdate(primary_entity_id, user_id)
        state.controller = controller
        setState(state)

        updateSections(controller).then(setSections)
        updateLimits(controller, primary_entity_id).then(setLimits)

        controller.subscribe(constants.store.SECTION, async () => setSections(await updateSections(controller)))
        controller.subscribe(constants.store.EXPENSES_ACTUAL, async () => !sections.length && setSections(await updateSections(controller)))

        controller.subscribe(constants.store.LIMIT, async () => setLimits(await updateLimits(controller, primary_entity_id)))
        controller.subscribe(constants.store.EXPENSES_PLAN, async () => {
            setLimits(await updateLimits(controller, primary_entity_id))
            !sections.length && setSections(await updateSections(controller))
        })
    }, [])


    useEffect(() => {
        if (worker && state.controller) {
            async function workerMessageHandler(e) {
                const {type, data : actions} = e.data
                if (state.controller) {
                    console.log('workerMessageHandler: ', e.data)
                    functionDurationTest(state.controller.actionHandler.bind(state.controller, actions), '[Основной поток] Время обработки actions: ')
                    !sections.length && setSections(await updateSections(state.controller))
                }
            }

            worker.addEventListener('message', workerMessageHandler)

            state.controller.onSendData = sendActionToWorker(worker, state.controller, primary_entity_id)

            return () => worker && worker.removeEventListener('message', workerMessageHandler)
        }
    }, [state.controller, worker])


    useEffect(() => {
        if (sections && sections.length) {
            const section = sections.find(s => s.title === 'Прочие расходы')
            const defaultSection = section ? section : null
            setState({...state, sections, defaultSection})
        }
    }, [sections])


    useEffect(() => {
        limits.length && setState({...state, limits})
    }, [limits])


    useEffect(() => {
            setState({...state, currency})
    }, [currency])

    if (!dbReady) {
        return null
    }

    return (
        <ExpensesContext.Provider value={state}>
            <Outlet/>
        </ExpensesContext.Provider>
    )
}
