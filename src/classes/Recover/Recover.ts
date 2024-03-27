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
    static async expense(travelID:string, user: User){
        const t: Record<string, Expense> = {}

        const ev: ExpenseVariantType[] = [StoreName.EXPENSES_PLAN, StoreName.EXPENSES_ACTUAL]

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
    static async limit(travelID: string, user: User){
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

    /**
     * метод, присвивает сущности измененные поля и обновляет запись в бд
     * @param action
     * @param [cb] опциональный коллбек (если указан, то поиск сущности в бд осуществляется по ключу, вернувшемуся из этого колбека)
     */
    static async assign<T extends {}>(action: Action<T>, cb?: (a: Action<T>) => string){
        let key = ''
        if(cb) key = cb(action)
        else if('id' in action.data) key = action.data.id as string

        if (!key) return

        let storeName = action.entity
        if(storeName.startsWith('expense')) storeName = StoreName.EXPENSE

        const entity = await DB.getOne<T>(storeName, key)
        if(!entity) return

        const changes = action.data
        const entityKeys = Object.keys(changes) as Array<keyof T>
        entityKeys.forEach(k => {
            if(entity[k] && typeof entity[k] === 'object') Object.assign(entity[k] as object, changes[k])
            else entity[k] = changes[k] as any
        })

        await DB.update(storeName, entity)
        return entity
    }
}