import {useContext} from "react";
import {ActionSubjectContext} from "./ActionSubjectContextProvider";

export function useActionSubject(){
    const context = useContext(ActionSubjectContext)
    return context.actionSubject
}