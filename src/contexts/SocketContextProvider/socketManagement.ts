//  'travel:join'
//  'travel:leave'
//  'travel:action'
//  'travel:message'
//  'disconnect'


import {Socket} from "socket.io-client";
import {Context} from "../../classes/Context/Context";
import {Action, Expense, Limit, Travel} from "../../classes/StoreEntities";
import {Recover} from "../../classes/Recover";
import {StoreName} from "../../types/StoreName";
import {DB} from "../../classes/db/DB";

export default function socketManagement(context: Context) {

    async function newTravelAction(this: Socket, msg: Action<Travel>) {
        const user = context.user
        if (!user) return

        msg.datetime = new Date(msg.datetime )
        if(msg.data.date_start) msg.data.date_start = new Date(msg.data.date_start)
        if(msg.data.date_end) msg.data.date_end = new Date(msg.data.date_end)
        if(msg.data.updated_at) msg.data.updated_at = new Date(msg.data.updated_at)
        if(msg.data.created_at) msg.data.created_at = new Date(msg.data.created_at)

        try {
            await DB.add(StoreName.ACTION, msg)
        }catch (e){}

        const travelID = msg.data.id
        const travel = await Recover.travel(travelID)
        await DB.update(StoreName.TRAVEL, travel)
        context.setTravel(travel)
    }


    function newTravelMessage(this: Socket, msg: any) {
        console.log(msg)
    }


    async function newExpenseAction(this: Socket, msg: Action<Partial<Expense>>) {
        const user = context.user
        if (!user) return

        msg.datetime = new Date(msg.datetime )
        if(msg.data.datetime) msg.data.datetime = new Date(msg.data.datetime)
        if(msg.data.created_at) msg.data.created_at = new Date(msg.data.created_at)

        const eID = msg.data.id
        const primaryID = msg.data.primary_entity_id
        try {
            await DB.add(StoreName.ACTION, msg)
        }catch (e){}
        if (eID && primaryID) {
            const expenses = await Recover.expense(primaryID, user)
            for (const e of expenses) {
                await DB.update(StoreName.EXPENSE, e)
            }
            return await DB.getOne(StoreName.EXPENSE, eID)
        }
    }


    async function newLimitAction(this: Socket, msg: Action<Partial<Limit>>) {
        const user = context.user
        if (!user) return

        msg.datetime = new Date(msg.datetime )

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