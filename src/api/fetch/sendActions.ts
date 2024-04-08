import {Action} from "../../classes/StoreEntities";
import aFetch from "../../axios";


type APISendActionResponseType = {
    [id: string]: { id: string, ok: boolean }
}

type APIResponseType = {
    ok: boolean,
    result: APISendActionResponseType
}


/**
 * меотд преобразует поля actions типа Date в ISOString и отправляет их на сервер
 * @param actions
 */
export async function sendActions(...actions: Action<any>[]) {
    // @ts-ignore
    actions.forEach(a => a.datetime = a.datetime.toISOString())
    actions.forEach(a => Object.entries(a.data)
        .forEach(([key, value]) => {
            if (value instanceof Date) {
                a.data[key] = value.toISOString()
            }
        }))

    const {data: response, status} = await aFetch.post<APIResponseType>('/actions/add/', actions)

    return {response, status}
}