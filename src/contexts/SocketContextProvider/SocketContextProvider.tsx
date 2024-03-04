import {Outlet} from "react-router-dom";
import {createContext, useEffect, useState} from "react";

import {useTravel, useUser} from "../AppContextProvider";
import {SocketMessage, SocketMessageType} from "../../classes/SocketMessage";


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

        const socket =  new WebSocket(`wss://${process.env.REACT_APP_SOCKET_SERVER_NAME}:62879?groupName=${travel.id}&userID=${user.id}`)

        socket.addEventListener('open', () => { setState({socket}) })

        socket.onclose = () => { setState({}) }
        socket.onerror = console.log

        socket.onmessage = (e: MessageEvent<SocketMessageType>) =>{
            console.log(e.data)
        }

        return () => {
            socket.close()
        }
    }, [])

    if (state.socket) window.socket = state.socket

    return (
        <SocketContext.Provider value={state}>
            <Outlet/>
        </SocketContext.Provider>
    )
}