import React, {createContext, useEffect, useState} from "react";
import {Outlet} from "react-router-dom";


export const WorkerContext = createContext(null)

export default function WorkerContextProvider() {
    const [worker, setWorker] = useState(null)


    useEffect(() => {
        if (window.Worker) {
            const w = new Worker(new URL('../workers/worker.js', import.meta.url))

            if (w){
                setWorker(w)
                w.onerror = console.error
            }

        }
    }, [])


    return (
        <WorkerContext.Provider value={{worker}} >
            <Outlet />
        </WorkerContext.Provider>
    )
}