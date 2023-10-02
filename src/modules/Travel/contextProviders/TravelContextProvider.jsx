import React, {createContext, useContext, useEffect, useState} from "react";
import {Outlet, useParams} from "react-router-dom";
import useTravel from "../hooks/useTravel";
import {WorkerContext} from "../../../contexts/WorkerContextProvider";
import sendActionToWorker from "../../../utils/sendActionToWorker";
import constants from "../../../static/constants";
import travelController from "../../../controllers/travelController/travelController";

/**
 * @typedef {Object} TravelContextState
 * @property {import('../models/travel/TravelType').TravelType} travel
 */

/**
 * @type TravelContextState
 */
const defaultState = {
    travel: null,
}

/**
 * предоставляет доступ к контроллеру модуля Travel
 * @type {React.Context<TravelContextState | null>}
 */
export const TravelContext = createContext(null)




/**
 * обертка для молуля Travel
 *
 * оборачивает в ExpensesContext
 * @returns {JSX.Element}
 * @constructor
 */
export default function TravelContextProvider() {
    const {travelCode} = useParams()
    const [state, setState] = useState(defaultState)
    const [dbReady, setDbReady] = useState(false)
    const {worker} = useContext(WorkerContext)

    const {travel, errorMessage} = useTravel(travelCode)


    useEffect(() => {
        state.travelController = travelController
        travelController.onReady = () => setDbReady(true)
        setState(state)
    }, [])


    useEffect(()=>{
        if (worker){
            state.travelController.onSendData = sendActionToWorker(worker, constants.store.TRAVEL_ACTIONS)
        }
    },[worker])


    useEffect(()=>{
        if (travel){
            setState({...state, travel})
        }
    }, [travel])

    if (!dbReady)
        return null

    return (
        <TravelContext.Provider value={state}>
            <Outlet/>
        </TravelContext.Provider>
    )
}