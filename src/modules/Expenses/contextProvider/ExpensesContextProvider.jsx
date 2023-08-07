import React, {createContext, useContext, useEffect, useState} from 'react'
import {Outlet, useNavigate, useParams} from "react-router-dom";

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
import constants from "../../../static/constants";
import schema from "../db/schema";

import '../css/Expenses.css'
import sendActionToWorker from "../../../utils/sendActionToWorker";
import usePostMessage from "../hooks/usePostMessage";
import expensesDB from "../db/expensesDB";
import {UserContext} from "../../../contexts/UserContextProvider.jsx";

/**
 * @typedef {Object} ExpensesContextState
 * @property {ActionController | null} controller
 * @property {SectionType | null} defaultSection
 * @property {Array.<SectionType> | []} sections
 * @property {Array.<LimitType> | []} limits
 * @property {Array.<CurrencyType> } currency
 */

/**
 * предоставляет доступ к контроллеру модуля Expenses
 * @type {React.Context<ExpensesContextState | null>}
 */
export const ExpensesContext = createContext(null)




/**
 * @type ExpensesContextState
 */
const defaultState = {
    controller: null,
    defaultSection: null,
    limits: [],
    sections: [],
    currency:[],
}

/**
 * обертка для молуля Expenses
 *
 * оборачивает в ExpensesContext
 * @param {string} user_id
 * @returns {JSX.Element}
 * @constructor
 */
export default function ExpensesContextProvider() {
    const navigate = useNavigate()
    const {travelCode: primary_entity_id} = useParams()
    const [dbReady, setDbReady] = useState(false)
    /**  @type {[ExpensesContextState, function]} */
    const [state, setState] = useState( defaultState)

    const [sections, setSections] = useState([])
    const [limits, setLimits] = useState([])

    const {worker} = useContext(WorkerContext)

    const currency = useCurrency()

    const [onSendSet, setOnSendSet] = useState(false)

    const {user} = useContext(UserContext)

    const user_id = user.id

    useDefaultSection(state.controller, primary_entity_id, user_id)

    usePostMessage(worker, primary_entity_id)


    useEffect(() => {
        const controller = new ActionController(expensesDB, {
            ...options,
            onReady: (dbr) => setDbReady(dbr)
        })


        state.controller = controller
        setState(state)

        updateSections(controller).then(setSections)
        updateLimits(controller, primary_entity_id).then(setLimits)

        const sectionSubscription = async () => setSections(await updateSections(controller))
        const limitsSubscription = async () => !sections.length && setSections(await updateSections(controller))
        const limitsSubscriptionWithPRkey = async () => setLimits(await updateLimits(controller, primary_entity_id))
        const onExpSubscr = async () => {
            setLimits(await updateLimits(controller, primary_entity_id))
            !sections.length && setSections(await updateSections(controller))
        }

        controller.subscribe(constants.store.SECTION, sectionSubscription)
        controller.subscribe(constants.store.EXPENSES_ACTUAL, limitsSubscription)
        controller.subscribe(constants.store.LIMIT, limitsSubscriptionWithPRkey)
        controller.subscribe(constants.store.EXPENSES_PLAN, onExpSubscr)

        return () => {
            controller.unsubscribe(constants.store.SECTION, sectionSubscription)
            controller.unsubscribe(constants.store.EXPENSES_ACTUAL, limitsSubscription)
            controller.unsubscribe(constants.store.LIMIT, limitsSubscriptionWithPRkey)
            controller.unsubscribe(constants.store.EXPENSES_PLAN, onExpSubscr)
        }
    }, [])

    useEffect(()=>{
        if (state.controller && currency ){
            state.controller.onUpdate = onUpdate(primary_entity_id, user_id, currency)
        }
    }, [state.controller, currency])


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



            return () => worker && worker.removeEventListener('message', workerMessageHandler)
        }
    }, [state.controller, worker])

    useEffect(() => {
        if(state.controller && worker && !onSendSet){
            state.controller.onSendData = sendActionToWorker(worker, constants.store.EXPENSES_ACTIONS)
            setOnSendSet(true)
        }
    }, [state.controller,worker, onSendSet])


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
