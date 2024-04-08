import aFetch from "../../axios";
import {Action} from "../../classes/StoreEntities";

type ResponseType<T extends {}> = {
    ok:boolean
    data?: Action<T>[]
    message?: string
}

const dateKeys = ['created_at', 'updated_at']

export async function fetchActions<T extends {}>(time_ms:number){
    const result = (await aFetch.post<ResponseType<T>>('/actions/get/', {time: time_ms})).data
    if(result.ok && result.data){
        const actions = result.data.map(a => new Action<T>(a.data, a.user_id, a.entity, a.action))
        actions.forEach(a => {
            Object.keys(a.data)
                .forEach(key => {
                    if(key.includes('date') || dateKeys.includes(key)){
                        // @ts-ignore
                        a.data[key] = new Date(a.data[key])
                    }
                })
        })
        return actions
    } else {
        return []
    }
}