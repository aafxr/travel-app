import React, {createContext, useEffect, useState} from "react";
import {Outlet} from "react-router-dom";

/**
 *@typedef {Object} WorkerContextType
 * @property {Worker} worker
 */

const defaultWorkerContext = {}

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