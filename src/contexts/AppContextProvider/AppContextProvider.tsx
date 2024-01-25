import {createContext, PropsWithChildren, useEffect, useState} from "react";
import {Context} from "../../classes/Context/Context";


type AppContextType = { context: Context }

export const AppContext = createContext<AppContextType>({context: new Context()})


export function AppContextProvider({children}: PropsWithChildren) {
    const [state, setContext] = useState<AppContextType | null>(null)

    useEffect(() => {
        const context = new Context()
        const unsubscribe = context.subscribe('update', () => {
            setContext(prev => prev ? {...prev} : prev)
        })
        setContext({context})
        return () => unsubscribe()
    }, [])


    if (!state) return null
    console.log(state.context)

    return (
        <AppContext.Provider value={state}>
            {children}
        </AppContext.Provider>
    )
}
