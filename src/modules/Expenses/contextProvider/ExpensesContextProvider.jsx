import React, {createContext, useContext, useEffect, useState} from 'react'
import {Outlet, useParams} from "react-router-dom";

import useSections from "../hooks/useSections";
import useLimits from "../hooks/useLimits";
import {WorkerContext} from "../../../contexts/WorkerContextProvider";
import useDefaultSection from "../hooks/useDefaultSections";

import ActionController from "../../../controllers/ActionController";
import options, {onUpdate} from '../controllers/controllerOptions'
import schema from "../db/schema";

import constants from "../db/constants";

import '../css/Expenses.css'
import {actionsBlackList, actionsWhiteList, actionswhiteList} from "../static/vars";


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

    const [sections, updateSections] = useSections(state.controller)
    const [limits, updateLimits] = useLimits(state.controller, primary_entity_id)

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
    }, [])


    useEffect(() => {
        if (worker && state.controller) {
            const controller = state.controller

            async function workerMessageHandler(e) {
                let actions = Array.isArray(e.data) ? e.data : [e.data]
                actions = actions.filter(a => !!a.data)

                if (state.controller) {
                    for (const action of actions) {
                        action.synced = action.synced ? 1: 0
                        if (actionsWhiteList.includes(action.entity)) {
                            action.data.value = +action.data.value
                            action.data.personal = +action.data.personal
                        }
                        await state.controller.actionHandler(action)
                    }
                }
            }

            if (worker && !registrWorkerListener) {
                worker.addEventListener('message', workerMessageHandler)
                registrWorkerListener = true

            }

            controller.onSendData = (action) => {
                worker.postMessage(
                    JSON.stringify([action])
                )
            }
            return () => worker && worker.removeEventListener('message', workerMessageHandler)
        }
    }, [state.controller, worker])


    useEffect(() => {
        if (state.controller) {
            updateSections()
            updateLimits()

            state.controller.subscribe(constants.store.SECTION, updateSections)
            state.controller.subscribe(constants.store.LIMIT, updateLimits)
            state.controller.subscribe(constants.store.EXPENSES_PLAN, updateLimits)

            return () => {
                state.controller.unsubscribe(constants.store.SECTION, updateSections)
                state.controller.unsubscribe(constants.store.LIMIT, updateLimits)
                state.controller.unsubscribe(constants.store.EXPENSES_PLAN, updateLimits)
            }
        }
    }, [state.controller])


    useEffect(() => {
        if (sections && sections.length) {
            const section = sections.find(s => s.title === 'Прочие расходы')
            const defaultSection = section ? section : null
            setState({...state, sections, defaultSection})
        }
    }, [sections])


    useEffect(() => {
        if (limits && limits.length) {
            setState({...state, limits})
        }
    }, [limits])


    if (!dbReady) {
        return null//<div>Loading...</div>
    }
    return (
        <ExpensesContext.Provider value={state}>
            <Outlet/>
        </ExpensesContext.Provider>
    )
}