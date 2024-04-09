import {Outlet} from "react-router-dom";
import {io, Socket} from "socket.io-client";
import {createContext, useEffect, useState} from "react";

import {useAppContext, useTravel, useUser} from "../AppContextProvider";
import socketManagement from "./socketManagement";
import {SMEType} from "./SMEType";
import {DB} from "../../classes/db/DB";
import {StoreName} from "../../types/StoreName";
import {Travel} from "../../classes/StoreEntities";
import defaultHandleError from "../../utils/error-handlers/defaultHandleError";


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

        const handle = socketManagement(context)

        const socket =  io(process.env.REACT_APP_SOCKET_URL as string) //{ host: process.env.REACT_APP_SOCKET_HOST ,port:process.env.REACT_APP_SOCKET_PORT, secure: true}
        console.log(process.env.REACT_APP_SOCKET_URL)
        console.log(socket)

        socket.on('connect', () => {
            console.log('socket connect')
            context.setSocket(socket)
            setState({socket})
        })

        socket.on('disconnect', () => {
            console.log('socket disconnect')
            setState({socket: undefined})
            context.setSocket(null)
        })

        socket.on('connect_error', (err: Error) => {
            console.error(err)
            setState({...state, errorMessage: err.message})
        })

        socket.on(SMEType.MESSAGE, handle.newTravelMessage)
        socket.on(SMEType.MESSAGE_RESULT, console.log)
        socket.on(SMEType.TRAVEL_ACTION, handle.newTravelAction)
        socket.on(SMEType.TRAVEL_ACTION_RESULT, console.log)
        socket.on(SMEType.EXPENSE_ACTION, handle.newExpenseAction)
        socket.on(SMEType.EXPENSE_ACTION_RESULT, console.log)
        socket.on(SMEType.LIMIT_ACTION, handle.newLimitAction)
        socket.on(SMEType.LIMIT_ACTION_RESULT, console.log)

        return () => {
            socket.emit('travel:leave', {travelID: travel.id})
            socket.close()
        }
    }, [])

    console.log(state)
    return (
        <SocketContext.Provider value={state}>
            <Outlet/>
        </SocketContext.Provider>
    )
}