import {Photo} from "../../classes/StoreEntities/Photo";

export async function fetchPhoto(id: string): Promise<Photo | undefined>{
    const src = undefined // (await aFetch.post<string>('/photo/get/', {id})).data
    if(src) {
        return new Photo({id, src})
    }
}