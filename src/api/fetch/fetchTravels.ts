import aFetch from "../../axios";
import {Travel} from "../../classes/StoreEntities";

export async function fetchTravels(): Promise<Travel[]>{
    let travels:Travel[] = (await aFetch.get('/travel/getList/')).data || []
    travels = travels.map(t => new Travel(t))
    return travels
}