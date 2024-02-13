import aFetch from "../../axios";
import {Photo} from "../../classes/StoreEntities/Photo";

export async function fetchPhoto(id: string): Promise<Photo | undefined>{
    const src = (await aFetch.post<string>('/photo/get/', {id})).data
    return new Photo({ id, src })
}