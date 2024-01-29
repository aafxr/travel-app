import {DB} from "../db/DB";
import {StoreName} from "../../types/StoreName";
import {PhotoType} from "../../types/PhotoType";
import {fetchPhoto} from "../../api/fetch/fetchPhoto";
import {CustomError} from "../errors/CustomError";

export class PhotoService{
    static async getById(id:string){
        let photo = await DB.getOne<PhotoType>(StoreName.Photo, id)
        try {
            if(!photo) photo = await fetchPhoto(id)
        }catch (e){
            if(e instanceof CustomError) throw e
            console.error(e)
        }
        return photo
    }
}