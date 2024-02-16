import {useContext} from "react";
import {ActionsWorkerContext} from "./ActionsWorkerContextProvider";

export function useActionsWorker(){
    return useContext(ActionsWorkerContext)
}