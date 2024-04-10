import {Travel} from "../../classes/StoreEntities";
import aFetch from "../../axios";

type ResponseSendTravelType = {
    ok:boolean
    request: Record<string, any>
    message: string
}

/**
 * send new travel to api
 * @param travel
 */
export async function sendNewTravel(travel: Travel){
    const response = await aFetch.post<ResponseSendTravelType>('/travel/add/', [travel])
    if(response.statusText === 'ok') {
        return response.data
    }
    else {
        return {
            ok: false,
            request: travel,
            message: response.statusText
        }
    }
}