import {PhotoType} from "../../types/PhotoType";
import aFetch from "../../axios";

export async function fetchPhoto(id: string): Promise<PhotoType | undefined>{
    const src = (await aFetch.post<string>('/photo/get/', {id})).data
    return { id, src }
}