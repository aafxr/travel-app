import {Action, Expense, Limit, Travel, User} from "../StoreEntities";
import {StoreName} from "../../types/StoreName";
import {IndexName} from "../../types/IndexName";
import {Recover} from "../Recover";
import {DB} from "../db/DB";
import {fetchActions} from "../../api/fetch";

/**
 * сервис для рабботы с actions
 */
export class ActionService{
    /**
     * методпозволяет полусить время последнего action хранимого в локальной бд
     */
    static async getLastActionTime(){
        const cursor = await DB.openIndexCursor<Action<any>>(StoreName.ACTION, IndexName.DATETIME, IDBKeyRange.upperBound(new Date()), "prev")
        const action = (await cursor.next()).value
        if(action) return new Date(action.datetime)
    }

    /**
     * метод для обработки поступившего action
     *
     * если в локальной бд есть action созданный после поступившего action то вызывается метод для востановления
     * сущности по имеющемся в бд actions
     *
     * @param action action пришедший "извне"
     * @param user
     * @return boolean возвращает true если принятый action был до проделанных манипуляций с сущностью
     */
    static async prepareNewAction<T extends {}>(action: Action<T>, user: User){
        console.log('prepareNewAction -> ', action)
        const storeName = action.entity
        action.datetime = new Date(action.datetime)

        const cursor = await DB.openIndexCursor<Action<any>>(StoreName.ACTION, IndexName.DATETIME,IDBKeyRange.lowerBound(action.datetime), "prev")
        const a = (await cursor.next()).value
        await DB.update(StoreName.ACTION, action)
        if(a && a.datetime > action.datetime){
            switch (storeName){
                case StoreName.TRAVEL:
                    return await Recover.travel((action as unknown as Action<Travel>).data.id)
                case StoreName.EXPENSE:
                    return await Recover.expense((action as unknown as Action<Expense>).data.primary_entity_id, user)
                case StoreName.LIMIT:
                    return await Recover.limit((action as unknown as Action<Limit>).data.primary_entity_id, user)
            }
        } else {
            return await Recover.assign(action)
        }
    }


    /**
     * метод для обработки поступившего actions
     *
     * @param actions actions пришедшие "извне"
     * @param user
     */
    static async prepaireNewActions(actions: Action<any>[], user: User){
        for (const a of actions)
            await ActionService.prepareNewAction(a, user)
    }


    /**
     * метод возвращает последний созданный action для указанного ид путешествия
     * @param travelId
     */
    static async getLastActionByTravelID(travelId:string){
        const cursor = DB.openIndexCursor<Action<Travel>>(StoreName.ACTION, IndexName.DATETIME, undefined, "prev")
        let lastAction = (await cursor.next()).value
        while(lastAction){
            if(lastAction.data.id === travelId) break
            lastAction = (await cursor.next()).value
        }
        return lastAction
    }



    static async checkNewActionsWhileReconnect(travelID: string){
        const lastActionTime = await ActionService.getLastActionTime()
        if(lastActionTime) {
            const newActions = await fetchActions(lastActionTime.getTime())
            const entites = new Set(newActions.map(a => a.entity.startsWith('expense')))
        }
    }
}