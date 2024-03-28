import aFetch from "../../axios";
import {Action} from "../../classes/StoreEntities";

type ResponseType<T extends {}> = {
    ok:boolean
    data?: Action<T>[]
    message?: string
}

export async function fetchActions<T extends {}>(time_ms:number){
    const result = (await aFetch.post<ResponseType<T>>('/actions/get/', {time: time_ms})).data
    if(result.ok && result.data){
        return result.data.map(a => new Action<T>(a.data, a.user_id, a.entity, a.action))
    } else {
        return []
    }
}