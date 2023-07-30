import React, {createContext, useContext, useEffect, useState} from "react";
import {Outlet, useParams} from "react-router-dom";
import ActionController from "../../../controllers/ActionController";
import schema from "../../Travel/db/schema";
import options from "../../Travel/controllers/controllerOptions";
import useTravel from "../hooks/useTravel";
import {WorkerContext} from "../../../contexts/WorkerContextProvider";
import toArray from "../../../utils/toArray";
import sendActionToWorker from "../../../utils/sendActionToWorker";
import constants from "../../../static/constants";
import travelDB from "../db/travelDB";

/**
 * @typedef {Object} TravelContextState
 * @property {ActionController | null} travelController
 * @property {import('../models/travel/TravelType').TravelType} travel
 */

/**
 * @type TravelContextState
 */
const defaultState = {
    travelController: null,
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
 * @param {string} user_id
 * @returns {JSX.Element}
 * @constructor
 */
export default function TravelContextProvider({user_id}) {
    const {travelCode} = useParams()
    const [state, setState] = useState(defaultState)
    const [dbReady, setDbReady] = useState(false)
    const {worker} = useContext(WorkerContext)

    const travel = useTravel(state.controller, travelCode)

    console.log(dbReady)

    useEffect(() => {
        state.travelController = new ActionController(travelDB, {
            ...options,
            onReady: (dbr) => setDbReady(dbr)
        })
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