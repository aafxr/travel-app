//  'travel:join'
//  'travel:leave'
//  'travel:action'
//  'travel:message'
//  'disconnect'


import {Context} from "../../classes/Context/Context";
import {Socket} from "socket.io-client";

export default function(context: Context){
    function newTravelAction(this: Socket, msg: any){
        console.log(msg)
    }

    function newTravelMessage(this: Socket, msg: any){
        console.log(msg)
    }

    return {
        newTravelAction,
        newTravelMessage
    }
}