import {Action, Travel} from "../StoreEntities";
import {StoreName} from "../../types/StoreName";
import {DB} from "../db/DB";

/**
 * класс содержит методы для востановления данных после востановления сети и наличия необработанных actions
 */
export class Recover{
    /**
     * метод востановления путешествия после пропадания интернета и наличия необработанных actions
     * @param id ид путешествия
     */
    static async travel(id: string){
        let t = new Travel({id})
        let actions = []

        const  cursor = await DB.openCursor<Action<Partial<Travel>>>(StoreName.TRAVEL)
        let action = (await cursor.next()).value
        while(action){
            if(action.entity === StoreName.TRAVEL && action.data.id === id) {
                action.datetime = new Date(action.datetime)
                actions.push(action)
            }
            action = (await cursor.next()).value
        }

        actions = actions.sort((a, b) => a.datetime.getTime() - b.datetime.getTime())

        actions.forEach(a => {
            const data = a.data
            const keys = Object.keys(data)
            for (const k of keys){
                const key = k as keyof Travel

                if(Array.isArray(data[key])){
                    // @ts-ignore
                    t[key] = Array.from(data[key])
                } else if(data[key] && typeof data[key] === 'object'){
                    // @ts-ignore
                    if(!t[key]) t[key] = {}

                    Object.assign(t[key], data[key])
                } else{
                    // @ts-ignore
                    t[key] = data[key]
                }
            }
        })

        return t
    }
}