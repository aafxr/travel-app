//  'travel:join'
//  'travel:leave'
//  'travel:action'
//  'travel:message'
//  'disconnect'


import {Socket} from "socket.io-client";
import {Context} from "../../classes/Context/Context";
import {Action, Expense, Limit, Travel} from "../../classes/StoreEntities";
import {ActionService} from "../../classes/services/ActionService";
import defaultHandleError from "../../utils/error-handlers/defaultHandleError";
import {Recover} from "../../classes/Recover";
import {StoreName} from "../../types/StoreName";
import {DB} from "../../classes/db/DB";

export default function socketManagement(context: Context) {

    function newTravelAction(this: Socket, msg: Action<Travel>) {
        const user = context.user
        if (!user) return

        ActionService
            .prepareNewAction(msg, user)
            .then(t => t && context.setTravel(t as Travel))
            .catch(defaultHandleError)
    }


    function newTravelMessage(this: Socket, msg: any) {
        console.log(msg)
    }


    async function newExpenseAction(this: Socket, msg: Action<Partial<Expense>>) {
        const user = context.user
        if (!user) return

        const eID = msg.data.id
        const primaryID = msg.data.primary_entity_id
        if (eID && primaryID) {
            const expenses = await Recover.expense(primaryID, user)
            for (const e of expenses) {
                await DB.update(StoreName.EXPENSE, e)
            }
            return await DB.getOne(msg.entity, eID)
        }
    }


    async function newLimitAction(this: Socket, msg: Action<Partial<Limit>>) {
        const user = context.user
        if (!user) return
        try {
            await DB.add(StoreName.ACTION, msg)
        } catch (e) {}

        const primary_entity_id = msg.data.primary_entity_id
        const limitID = msg.data.id
        if (primary_entity_id) {
            const limits = await Recover.limit(primary_entity_id, user)
            for (const l of limits) await DB.update(StoreName.LIMIT, l)
            return limits.find(l => l.id === limitID)
        }
    }

    return {
        newTravelAction,
        newTravelMessage,
        newExpenseAction,
        newLimitAction
    }
}