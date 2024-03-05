import {Action, Expense, Limit, Travel, User} from "../StoreEntities";
import {StoreName} from "../../types/StoreName";
import {DB} from "../db/DB";
import {ExpenseVariantType} from "../../types/ExpenseType";


/**
 * класс содержит методы для востановления данных после востановления сети и наличия необработанных actions
 */
export class Recover{
    /**
     * метод востановления путешествия после пропадания интернета и наличия необработанных actions
     * @param travelID ид путешествия
     */
    static async travel(travelID: string){
        let t = new Travel({id: travelID})

        const predicate = (a:Action<Partial<Travel>>) => a.entity === StoreName.TRAVEL && a.data.id === travelID

        let actions = await DB.getLocalActions(predicate)

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

    /**
     * метод востановления расходов после пропадания интернета и наличия необработанных actions
     * @param travelID ид путешествия
     * @param user
     */
    async expense(travelID:string, user: User){
        const t: Record<string, Expense> = {}

        const ev: ExpenseVariantType[] = ["expenses_plan", "expenses_actual"]

        const predicate = (a: Action<Expense>) => ev.includes(a.entity as ExpenseVariantType) && a.data.primary_entity_id === travelID

        let actions = await DB.getLocalActions(predicate)

        actions = actions.sort((a, b) => a.datetime.getTime() - b.datetime.getTime())

        actions.forEach(a => {
            const {id, primary_entity_id} = a.data
            if(!t[id]) t[id] = new Expense({id, primary_entity_id }, user)

            Object.assign(t[id], a.data)
        })

        return Object.values(t)
    }

    /**
     * метод востановления лимта после пропадания интернета и наличия необработанных actions
     * @param travelID ид путешествия
     * @param user
     */
    async limit(travelID: string, user: User){
        const t: Record<string, Limit> = {}

        const predicate = (a: Action<Limit>) => a.entity === StoreName.LIMIT && a.data.primary_entity_id === travelID

        let actions = await DB.getLocalActions(predicate)

        actions = actions.sort((a, b) => a.datetime.getTime() - b.datetime.getTime())

        actions.forEach(a => {
            const {id, primary_entity_id} = a.data
            if(!t[id]) t[id] = new Limit({id, primary_entity_id, section_id: '' }, user)

            Object.assign(t[id], a.data)
        })

        return Object.values(t)
    }
}