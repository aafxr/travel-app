import aFetch from "../../axios";
import {APIPlaceType} from "../../types/APIPlaceType";

export  async function fetchPlaces(text: string): Promise<APIPlaceType[]>{
    const response = (await aFetch.post('/places/getList/', {text})).data
    if (response.ok && Array.isArray(response.data))return response.data
    return []
}