import aFetch from "../../axios";
import {Travel} from "../../classes/StoreEntities";

type GetListResposneType = {
    ok: boolean
    data: Travel[]
    message?: string
}

export async function fetchTravels(): Promise<Travel[]>{
    try {
        const request = (await aFetch.get<GetListResposneType>('/travel/getList/')).data
        let travels:Travel[] = request.ok ? request.data : []
        travels = travels.map(t => new Travel(t))
        return travels
    } catch (e) {
        return []
    }
}