import {createContext, PropsWithChildren, useContext} from "react";
import {Subject} from "rxjs";
import {Action} from "../../classes/StoreEntities";

type ActionSubjectContextType = {
    actionSubject: Subject<Action<any>>
}

export const ActionSubjectContext = createContext<ActionSubjectContextType>({actionSubject: new Subject()})

export function ActionSubjectContextProvider({children}:PropsWithChildren){
    const context = useContext(ActionSubjectContext)

    return (
        <ActionSubjectContext.Provider value={context}>
            {children}
        </ActionSubjectContext.Provider>
    )
}