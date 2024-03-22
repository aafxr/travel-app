//  'travel:join'
//  'travel:leave'
//  'travel:action'
//  'travel:message'
//  'disconnect'


import {Socket} from "socket.io-client";
import {Context} from "../../classes/Context/Context";
import {Action, Travel} from "../../classes/StoreEntities";
import {ActionService} from "../../classes/services/ActionService";
import defaultHandleError from "../../utils/error-handlers/defaultHandleError";

export default function socketManagement(context: Context){
    function newTravelAction(this: Socket, msg: Action<Travel>){
        const user = context.user
        if(!user) return

        ActionService
            .prepareNewAction(msg, user)
            .then(t => t && context.setTravel(t as Travel))
            .catch(defaultHandleError)
    }

    function newTravelMessage(this: Socket, msg: any){
        console.log(msg)
    }

    return {
        newTravelAction,
        newTravelMessage
    }
}