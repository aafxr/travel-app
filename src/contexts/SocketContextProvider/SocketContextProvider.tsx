import {Outlet} from "react-router-dom";
import {createContext, useEffect, useState} from "react";

import {useTravel, useUser} from "../AppContextProvider";


export type SocketContextType = {
    socket?: WebSocket | undefined
}


export const  SocketContext = createContext<SocketContextType>({})



export function SocketContextProvider(){
    const [state, setState] = useState<SocketContextType>({})
    const travel = useTravel()
    const user = useUser()

    useEffect(() => {
        if(!travel || !user) return

        const socket =  new WebSocket(`ws://${process.env.REACT_APP_SOCKET_SERVER_NAME}:62879?groupName=${travel.id}&userID=${user.id}`)

        socket.addEventListener('open', () => {
            console.log('[X] socket')
            setState({socket})
        })

        socket.onclose = () => setState({})
        socket.onerror = console.log

        return () => {socket.close()}
    }, [])


    return (
        <SocketContext.Provider value={state}>
            <Outlet/>
        </SocketContext.Provider>
    )
}