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
import functionDurationTest from "../../../utils/functionDurationTest";
import {LocalDB} from "../../../db";
import Model from "../../../models/Model";
import limitValidationObj from "../models/limit/validation";
import expensesValidationObj from "../models/expenses/validation";
import sectionValidationObj from "../models/section/validation";
import ErrorReport from "../../../controllers/ErrorReport";


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
 * @property {import('../../../models/Model').default} limitModel
 * @property {import('../../../models/Model').default} expensesActualModel
 * @property {import('../../../models/Model').default} expensesPlanModel
 * @property {import('../../../models/Model').default} sectionModel
 */

/**
 * @type ExpensesContextState
 */

const defaultState = {
    defaultSection: null,
    limits: [],
    sections: [],
    limitModel: null,
    expensesActualModel: null,
    expensesPlanModel: null,
    sectionModel: null
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
    const [state, setState] = useState(defaultState)

    const [sections, setSections] = useState([])
    const [limits, setLimits] = useState([])

    const {worker} = useContext(WorkerContext)



    useEffect(() => {
        new LocalDB(schema, {
                onReady(db) {
                    const limitModel = new Model(db, constants.store.LIMIT, limitValidationObj)
                    const expensesActualModel = new Model(db, constants.store.EXPENSES_ACTUAL, expensesValidationObj)
                    const expensesPlanModel = new Model(db, constants.store.EXPENSES_PLAN, expensesValidationObj)
                    const sectionModel = new Model(db, constants.store.SECTION, sectionValidationObj)

                    sectionModel.get('all').then(setSections)
                    limitModel.getFromIndex(constants.indexes.PRIMARY_ENTITY_ID, primary_entity_id).then(setLimits)

                    setState({
                        ...state,
                        limitModel,
                        expensesActualModel,
                        expensesPlanModel,
                        sectionModel
                    })
                    setDbReady(true)
                },

                onError(err) {
                    ErrorReport.sendError(err).catch(console.error)
                }
            }
        )
    }, [])


    useDefaultSection(state.sectionModel, primary_entity_id, user_id)


    useEffect(() => {
        if (worker && dbReady) {
            async function workerMessageHandler(e) {
                let {type, storeName} = e.data

                if (type === 'update') {
                    functionDurationTest(() => {
                        return new Promise((resolve) => {
                            // storeName === constants.store.LIMIT &&
                            // storeName === constants.store.SECTION &&
                            Promise.all(
                                [
                                    state.limitModel.getFromIndex(constants.indexes.PRIMARY_ENTITY_ID, primary_entity_id).then(setLimits),
                                    state.sectionModel.get('all').then(setSections)
                                ]
                            ).then(resolve)
                        })
                    }, `[Основной поток {${storeName}}] Время обработки actions: `)
                    !sections.length && state.sectionModel.get('all').then(setSections)
                }
            }

            worker.addEventListener('message', workerMessageHandler)

            return () => worker && worker.removeEventListener('message', workerMessageHandler)
        }
    }, [dbReady, worker, primary_entity_id])


    useEffect(() => {
        setState({...state, sections, limits})
    }, [sections, limits])



    if (!dbReady) {
        return null
    }
    return (
        <ExpensesContext.Provider value={state}>
            <Outlet/>
        </ExpensesContext.Provider>
    )
}
