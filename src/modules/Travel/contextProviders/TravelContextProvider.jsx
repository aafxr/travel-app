import React, {createContext, useEffect, useState} from "react";
import {Outlet, useParams} from "react-router-dom";
import ActionController from "../../../controllers/ActionController";
import schema from "../../Travel/db/schema";
import options from "../../Travel/controllers/controllerOptions";
import useTravel from "../hooks/useTravel";

/**
 * предоставляет доступ к контроллеру модуля Travel
 * @type {React.Context<null>}
 */
export const TravelContext = createContext(null)


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
 * обертка для молуля Travel
 *
 * оборачивает в ExpensesContext
 * @param {string} user_id
 * @returns {JSX.Element}
 * @constructor
 */
export default function TravelContextProvider({user_id}) {
    const {travelCode} = useParams()
    /**  @type {[TravelContextState, function]} */
    const [state, setState] = useState(defaultState)
    const [dbReady, setDbReady] = useState(false)

    const travel = useTravel(state.controller, travelCode)



    useEffect(() => {
        state.travelController = new ActionController(schema,
            {
                ...options,
                onReady: () => setDbReady(true),
                onError: console.error
            })
        setState(state)
    }, [])


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