import {Action, Travel} from "../StoreEntities";
import {StoreName} from "../../types/StoreName";
import {SocketError} from "../errors/SocketError";
import {DB} from "../db/DB";
import {IndexName} from "../../types/IndexName";
import {Recover} from "../Recover";

export class SocketService{

    /**
     * анный метод
     * - принимает сообщение полученное через сокет
     * - осуществляет поиск последнего action связанного с данным путешествием
     * - обновляет запись о путешествии в бд, если пришедший action пришел после уже имеющихся в бд actions
     * - возвращает актуальное состояние путешествия
     * @param msg
     * @returns {Travel}
     */
    static async onTravelAction(msg: string){
        const action: Action<Travel> = JSON.parse(msg)
        action.datetime = new Date(action.datetime)
        if(action.entity !== StoreName.TRAVEL) throw SocketError.UnexpectedActionEntityType(action)

        const cursor = await DB.openIndexCursor<Action<Travel>>(StoreName.ACTION, IndexName.DATETIME, undefined, "prev")
        let lastAction = (await cursor.next()).value
        while(lastAction){
            if(lastAction.entity === StoreName.TRAVEL && lastAction.data.id === action.data.id) break
            lastAction = (await cursor.next()).value
        }

        await DB.writeAllToStore(StoreName.ACTION, [action])

        if(lastAction){
            lastAction.datetime = new Date(lastAction.datetime)
            if(action.datetime < lastAction.datetime){
                const travel = await Recover.travel(action.data.id)
                await DB.writeAllToStore(StoreName.TRAVEL, [travel])
                return travel
            } else {
                return await Recover.asign<Travel>(action)
            }
        }

    }
}