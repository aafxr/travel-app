import {useContext} from "react";
import {SocketContext} from "./SocketContextProvider";

export function useSocket(){
    return useContext(SocketContext).socket
}