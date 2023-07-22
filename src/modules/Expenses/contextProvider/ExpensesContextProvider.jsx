import React, {createContext, useContext, useEffect, useState} from 'react'
import {Outlet, useParams} from "react-router-dom";

import {WorkerContext} from "../../../contexts/WorkerContextProvider";
import useDefaultSection from "../hooks/useDefaultSections";

import ActionController from "../../../controllers/ActionController";
import options from '../controllers/controllerOptions'
import schema from "../db/schema";

import constants from "../db/constants";

import toArray from "../../../utils/toArray";
import {onUpdate} from "../controllers/onUpdate";
import updateSections from "../helpers/updateSections";

import '../css/Expenses.css'
import updateLimits from "../helpers/updateLimits";


/**
 * предоставляет доступ к контроллеру модуля Expenses
 * @type {React.Context<null>}
 */
export const ExpensesContext = createContext(null)


/**
 * @typedef {Object} ExpensesContextState
 * @property {controller: import('../../../controllers/ActionController').ActionController| null} controller
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

let registrWorkerListener = false
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
    const [state, setState] = useState(defaultState)

    const [sections, setSections] = useState([])
    const [limits, setLimits] = useState([])

    const {worker} = useContext(WorkerContext)

    useDefaultSection(state.controller, primary_entity_id, user_id)


    useEffect(() => {
        const controller = new ActionController(schema, {
            ...options,
            onReady: () => {
                setDbReady(true)
            },
            onError: console.error
        })
        controller.onUpdate = onUpdate(primary_entity_id, user_id)
        setState({...state, controller})

        updateSections(controller).then(setSections)
        updateLimits(controller, primary_entity_id).then(setLimits)

        controller.subscribe(constants.store.SECTION, async () => setSections(await updateSections(controller)) )
        controller.subscribe(constants.store.LIMIT, async () => setLimits (await updateLimits(controller, primary_entity_id)))
        controller.subscribe(constants.store.EXPENSES_PLAN, async () => setLimits (await updateLimits(controller, primary_entity_id)))

        return () => {
            controller.unsubscribe(constants.store.SECTION, async () => setSections(await updateSections(controller)) )
            controller.unsubscribe(constants.store.LIMIT, async () => setLimits (await updateLimits(controller, primary_entity_id)))
            controller.unsubscribe(constants.store.EXPENSES_PLAN, async () => setLimits (await updateLimits(controller, primary_entity_id)))
        }
    }, [])


    useEffect(() => {
        if (worker && state.controller) {
            async function workerMessageHandler(e) {
                let actions = toArray(e.data)
                if (state.controller) {
                    await state.controller.actionHandler(actions)
                }
            }

                worker.addEventListener('message', workerMessageHandler)

            state.controller.onSendData = (action) => {
                worker.postMessage(
                    JSON.stringify(toArray(action))
                )
            }
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
    } , [limits])


    if (!dbReady) {
        return null//<div>Loading...</div>
    }
    return (
        <ExpensesContext.Provider value={state}>
            <Outlet/>
        </ExpensesContext.Provider>
    )
}