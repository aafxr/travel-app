import React, {createContext, useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {USER_AUTH} from "../static/constants";

/**
 *@typedef {Object} WorkerContextType
 * @property {Worker | null} worker
 */

const defaultWorkerContext = {
    worker: null
}

/**
 *
 * @type {React.Context<WorkerContextType | {}>}
 */
export const WorkerContext = createContext({})

export default function WorkerContextProvider() {
    const [state, setState] = useState(defaultWorkerContext)


    useEffect(() => {
        if (window.Worker) {
            const w = new Worker(new URL('../workers/worker.js', import.meta.url))

            if (w){
                state.worker = w
                setState(state)
                w.onerror = console.error
            }

        }
    }, [])

    return (
        <WorkerContext.Provider value={state} >
            <Outlet />
        </WorkerContext.Provider>
    )
}