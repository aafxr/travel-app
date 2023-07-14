import React, {createContext, useContext, useEffect, useState} from 'react'
import {Outlet, useParams} from "react-router-dom";

import ActionController from "../../../controllers/ActionController";
import schema from "../db/schema";
import options, {onUpdate} from '../controllers/controllerOptions'

import '../css/Expenses.css'
import constants from "../db/constants";
import createId from "../../../utils/createId";
import useSections from "../hooks/useSections";
import useLimits from "../hooks/useLimits";
import {WorkerContext} from "../../../contexts/WorkerContextProvider";
import useDefaultSection from "../hooks/useDefaultSections";


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

// const defaultSections = ['Прочие расходы', 'Перелет', 'Отель', 'Музей', 'Архитектура', 'Экскурсия', 'Природа']
// let writing = false
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

            function workerMessageHandler(e) {
                state.controller && state.controller.actionHandler(e.data).catch(console.error)
            }

            worker && worker.addEventListener('message', workerMessageHandler)


            controller.onSendData = (action) => worker.postMessage(
                JSON.stringify(action)
            )

        return () => worker && worker.removeEventListener('message', workerMessageHandler)
        }

    }, [state.controller, worker])


    useEffect(() => {
        if (state.controller) {
            updateSections()
            updateLimits()

            state.controller.subscribe(constants.store.SECTION, updateSections)
            state.controller.subscribe(constants.store.LIMIT, updateLimits)

            return () => {
                state.controller.unsubscribe(constants.store.SECTION, updateSections)
                state.controller.unsubscribe(constants.store.LIMIT, updateLimits)
            }
        }
    }, [state.controller])


    useDefaultSection(state.controller, primary_entity_id, user_id)

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
        return <div>Loading...</div>
    }
    return (
        <ExpensesContext.Provider value={state}>
            <Outlet/>
        </ExpensesContext.Provider>
    )
}