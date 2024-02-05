import {TelegramAuthPayloadType} from "../../types/TelegramAuthPayloadType";
import {APIResponseType} from "./types/APIResponseType";
import {User} from "../../classes/StoreEntities";
import {UserType} from "../../types/UserType";
import aFetch from "../../axios";

export async function fetchUserAuthTg(authPayload: TelegramAuthPayloadType){
    const response = await aFetch.post<APIResponseType<UserType>>('/user/auth/tg/', authPayload)
    if(response.data.ok){
        return new User(response.data.data)
    }
}