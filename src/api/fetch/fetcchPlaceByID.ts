import aFetch from "../../axios";
import {APIPlaceType} from "../../types/APIPlaceType";

export async function fetchPlaceByID(placeID: string){
    return (await aFetch.post<APIPlaceType>('/places/getByID/', {id: placeID})).data

}