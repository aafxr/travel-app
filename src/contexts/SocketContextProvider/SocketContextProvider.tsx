import {Outlet} from "react-router-dom";
import {io, Socket} from "socket.io-client";
import {createContext, useEffect, useState} from "react";

import {useAppContext, useTravel, useUser} from "../AppContextProvider";
import socketManagement from "./socketManagement";
import {SMEType} from "./SMEType";


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

        socket.on('connect', () => {
            socket.emit('travel:join',{travelID: travel.id})
            socket.emit('travel:join:result', console.log)
            context.setSocket(socket)
            setState({socket})
        })

        socket.on('disconnect', () => {
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

        // (msg) =>
        // SocketService
        //     .onTravelAction(msg)
        //     .then(t => t && context.setTravel(travel))
        //     .catch(defaultHandleError)


        return () => {
            socket.emit('travel:leave', {travelID: travel.id})
            socket.close()
        }
    }, [])


    return (
        <SocketContext.Provider value={state}>
            <Outlet/>
        </SocketContext.Provider>
    )
}