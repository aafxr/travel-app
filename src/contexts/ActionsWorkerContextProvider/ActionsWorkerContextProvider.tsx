import {Outlet} from "react-router-dom";
import React, {createContext, useEffect, useState} from "react";

import {ConnectionService} from "../../classes/services/ConnectionService";
import {useAppContext, useUser} from "../AppContextProvider";
import {ActionWorkerMessage, ActionWorkerMessageType} from "./ActionWorkerMessage";
import defaultHandleError from "../../utils/error-handlers/defaultHandleError";


type WorkerContextType = {
    worker: Worker | null
}

const defaultWorkerContext: WorkerContextType = {
    worker: null
}

export const ActionsWorkerContext = createContext<WorkerContextType>({worker: null})

/** добавляет контекст для доступа к воркеру */
export default function ActionsWorkerContextProvider() {
    const user = useUser()
    const context = useAppContext()
    const [state, setState] = useState(defaultWorkerContext)

    /** инициализируем ворке если браузер потдерживает воркеры */
    useEffect(() => {
        if(!user) return
        const worker = new Worker(new URL('./actionsWorker.ts', import.meta.url))
        worker.postMessage(ActionWorkerMessage.init(user))

        worker.onmessage = (e: MessageEvent<ActionWorkerMessageType>) => {
            const message = e.data
            if(message.type === "unauthorized"){
                ConnectionService.refresh(user)
                    .then(u =>{
                        if (u){
                            worker.postMessage({type: 'user', payload: u})
                            context.setUser(u)
                        }
                    })
                    .catch(defaultHandleError)
            }
        }

        setState({worker})
        return () => {worker.terminate()}
    }, [])

    return (
        <ActionsWorkerContext.Provider value={state}>
            <Outlet/>
        </ActionsWorkerContext.Provider>
    )
}