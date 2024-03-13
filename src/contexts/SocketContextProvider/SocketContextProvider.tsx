import {Outlet} from "react-router-dom";
import {createContext, useEffect, useState} from "react";

import {useTravel, useUser} from "../AppContextProvider";
import { SocketMessageType} from "../../classes/SocketMessage";
import {io, Socket} from "socket.io-client";


export type SocketContextType = {
    socket?: Socket | undefined
    errorMessage?: string
}


export const  SocketContext = createContext<SocketContextType>({})



export function SocketContextProvider(){
    const [state, setState] = useState<SocketContextType>({})
    const travel = useTravel()
    const user = useUser()

    useEffect(() => {
        if(!travel || !user) return

        const socket =  io(process.env.REACT_APP_SOCKET_URL as string) //{ host: process.env.REACT_APP_SOCKET_HOST ,port:process.env.REACT_APP_SOCKET_PORT, secure: true}

        socket.on('connect', () => {
            socket.emit('join',{join:{travelID: travel.id}})

            setState({socket})
        })
        socket.on('disconnect', () => setState({socket: undefined}))
        socket.on('connect_error', (err: Error) => {
            console.error(err)
            setState({...state, errorMessage: err.message})
        })

        socket.on('message', (msg) => console.log(msg))

        return () => { socket.close() }
    }, [])

    if (state.socket) {
        window.socket = state.socket
        window.sendMessage = (id:string, message: string = 'test message') => window.socket.emit('message',{message:{primary_entity_id: id, text: message}})
    }

    return (
        <SocketContext.Provider value={state}>
            <Outlet/>
        </SocketContext.Provider>
    )
}