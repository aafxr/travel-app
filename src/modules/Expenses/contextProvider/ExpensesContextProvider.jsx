import React, {createContext, useEffect, useState} from 'react'
import {Outlet, useParams} from "react-router-dom";

import ActionController from "../../../controllers/ActionController";
import schema from "../db/schema";
import options, {onUpdate} from '../controllers/controllerOptions'

import '../css/Expenses.css'
import constants from "../db/constants";
import createId from "../../../utils/createId";
import useSections from "../hooks/useSections";
import useLimits from "../hooks/useLimits";


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

const defaultSections = ['Прочие расходы', 'Перелет', 'Отель', 'Музей', 'Архитектура', 'Экскурсия', 'Природа']
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


    // добавлени дефолтных секций
    useEffect(() => {
        async function addDefaultSections() {
            if (!state.controller) return

            const sectionList = await state.controller.read({
                storeName: constants.store.SECTION,
                action: 'get',
                query: 'all'
            })


            if (!sectionList.length) {
                for (const sectionName of defaultSections) {
                    const data = {
                        title: sectionName,
                        color: '#52CF37',
                        hidden: 1,
                        primary_entity_id,
                        id: createId(user_id)
                    }

                    await state.controller.write({
                        storeName: constants.store.SECTION,
                        action: 'add',
                        user_id,
                        data
                    })
                        .then(console.log)
                }
            }
        }

        updateSections()
        addDefaultSections()
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
        return <div>Loading...</div>
    }
    return (
        <ExpensesContext.Provider value={state}>
            <Outlet/>
        </ExpensesContext.Provider>
    )
}