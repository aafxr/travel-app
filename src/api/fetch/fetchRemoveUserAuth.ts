import {User} from "../../classes/StoreEntities";
import aFetch from "../../axios";
import {REFRESH_TOKEN} from "../../static/constants";

export async function fetchRemoveUserAuth(user:User){
    await aFetch.post('/user/auth/remove/', {
        [REFRESH_TOKEN]: user.refresh_token
    })
}