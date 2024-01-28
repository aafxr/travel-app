import {createContext, PropsWithChildren, useEffect, useState} from "react";
import {Context} from "../../classes/Context/Context";


type AppContextType = { context: Context }

export const AppContext = createContext<AppContextType>({context: new Context()})


export function AppContextProvider({children}: PropsWithChildren) {
    const [state, setContext] = useState<AppContextType | null>(null)

    useEffect(() => {
        const context = new Context()
        const unsubscribe = context.subscribe('update', (ctx) => {
            setContext({context:ctx})
        })
        setContext({context})
        return () => unsubscribe()
    }, [])


    if (!state) return null
    window.context = state.context

    return (
        <AppContext.Provider value={state}>
            {children}
        </AppContext.Provider>
    )
}
