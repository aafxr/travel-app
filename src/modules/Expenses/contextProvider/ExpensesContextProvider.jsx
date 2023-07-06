import React, {createContext, useCallback, useEffect, useState} from 'react'
import {Outlet, useParams} from "react-router-dom";

import ActionController from "../../../controllers/ActionController";
import schema from "../db/schema";
import options, {onUpdate} from '../controllers/controllerOptions'

import '../css/Expenses.css'
import constants from "../db/constants";
import createId from "../../../utils/createId";
import useSections from "../hooks/useSections";


/**
 * предоставляет доступ к контроллеру модуля Expenses
 * @type {React.Context<null>}
 */
export const ExpensesContext = createContext(null)

const sections = ['Прочие расходы', 'Перелет', 'Отель', 'Музей', 'Архитектура', 'Экскурсия', 'Природа']
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
    const [state, setState] = useState({})

    const [sections, updateSections] = useSections(state.controller)

    useEffect(() => {
        const controller = new ActionController(schema, {
            ...options,
            onReady: () => {
                setDbReady(true)
            },
            onError: console.error
        })

        controller.onUpdate = onUpdate(primary_entity_id)

        setState({...state, controller})
    }, [])


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
                for (const sectionName of sections) {
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
                }
            }
        }

        updateSections()
        addDefaultSections()
    }, [state.controller])

    useEffect(() => {
        if (sections && sections.length) {
            const section = sections.find(s => s.title === 'Прочие расходы')
            const defaultSectionId = section ? section.id : null
            setState({...state, defaultSectionId})
        }
    }, [sections])


    if (!dbReady) {
        return <div>Loading...</div>
    }
    return (
        <ExpensesContext.Provider value={state}>
            <Outlet/>
        </ExpensesContext.Provider>
    )
}