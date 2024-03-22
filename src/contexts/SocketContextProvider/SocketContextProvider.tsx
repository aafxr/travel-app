import {Outlet} from "react-router-dom";
import {createContext, useEffect, useState} from "react";

import {useAppContext, useTravel, useUser} from "../AppContextProvider";
import { SocketMessageType} from "../../classes/SocketMessage";
import {io, Socket} from "socket.io-client";
import {pushAlertMessage} from "../../components/Alerts/Alerts";
import {Message} from "../../classes/StoreEntities";
import {MessageService} from "../../classes/services";
import defaultHandleError from "../../utils/error-handlers/defaultHandleError";
import {SocketService} from "../../classes/services/SocketService";


export type SocketContextType = {
    socket?: Socket | undefined
    errorMessage?: string
}


export const  SocketContext = createContext<SocketContextType>({})



export function SocketContextProvider(){
    const [state, setState] = useState<SocketContextType>({})
    const context = useAppContext()
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

        socket.on('message', (msg) => {
            SocketService
                .onMessage(msg)
                .catch(defaultHandleError)
        })

        socket.on('travel-action', (msg) =>
            SocketService
                .onTravelAction(msg)
                .then(t => t && context.setTravel(travel))
                .catch(defaultHandleError)
        )


        return () => { socket.close() }
    }, [])


    return (
        <SocketContext.Provider value={state}>
            <Outlet/>
        </SocketContext.Provider>
    )
}