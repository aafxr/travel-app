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
    return (await aFetch.post<ResponseSendTravelType>('/travel/add/', travel)).data
}