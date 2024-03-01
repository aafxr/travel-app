import {fetchPhoto} from "../../api/fetch/fetchPhoto";
import {sendPhoto} from "../../api/fetch/sendPhoto";
import {CustomError} from "../errors/CustomError";
import {StoreName} from "../../types/StoreName";
import {PhotoType} from "../../types/PhotoType";
import {Photo} from "../StoreEntities/Photo";
import {UserService} from "./UserService";
import {User} from "../StoreEntities";
import {DB} from "../db/DB";


/**
 * сеервис для работы с изображениями
 * (созранение, изменение информации об изображении)
 *
 * ---
 * доступны следующие методы:
 * - getById
 * - updateUserPhoto
 * - save
 * - initPhoto
 */
export class PhotoService{

    /**
     * метод для загрузки изображения из локальной бд
     * @param id ид изображения
     */
    static async getById(id:string){
        let photo = await DB.getOne<Photo>(StoreName.Photo, id)
        if(photo) photo = new Photo(photo)

        try {
            if(!photo) photo = await fetchPhoto(id)
        }catch (e){
            if(e instanceof CustomError) throw e
            console.error(e)
        }
        return photo
    }

    /**
     * метод обновляет фото пользователя в бд, оюновляет данные о пользователе и генерирует экшен
     * @param user
     * @param blob
     */
    static async updateUserPhoto(user: User, blob: Blob){
        const photo = new Photo({blob})
        if(user.photo) photo.id = user.photo
        else user.photo = photo.id
        await UserService.update(user)
        await PhotoService.save(photo)
        await sendPhoto(user.id, blob)
        user.setPhoto(photo)
    }

    /**
     * метод для созранения изображения в бд
     * @param photo
     */
    static async save(photo:Photo){
        await DB.update(StoreName.Photo, photo)
    }

    static async initPhoto<T extends {photo: string, setPhoto:(photo:Photo) => unknown}>(items:T[]){
        for (const item of items){
            if (item.photo){
                const photo_type = await DB.getOne<PhotoType>(StoreName.Photo, item.photo)
                if (photo_type) item.setPhoto(new Photo(photo_type))
            }
        }
        return items
    }
}