import React, {createContext, useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import ErrorReport from "../controllers/ErrorReport";

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

/** добавляет контекст для доступа к воркеру */
export default function WorkerContextProvider() {
    const [state, setState] = useState(defaultWorkerContext)

    /** инициализируем ворке если браузер потдерживает воркеры */
    useEffect(() => {
        if (window.Worker) {
            const w = new Worker(new URL('../workers/worker.js', import.meta.url))

            if (w){
                state.worker = w
                setState(state)
                w.onerror = (err) => {
                    console.error(err)
                    /** при ошибке инициализации воркера, отправляем сообщения об ошибке */
                    ErrorReport.sendError(err).catch(console.error)
                }
                /**@type{WorkerMessageType} */
                const message = {type: "update-expenses-actual"}
                w.postMessage(message)
                process.env.NODE_ENV === 'production' && w.postMessage({type: 'init'})

            }
        }
    }, [])

    return (
        <WorkerContext.Provider value={state} >
            <Outlet />
        </WorkerContext.Provider>
    )
}