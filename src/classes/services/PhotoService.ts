import {DB} from "../db/DB";
import {StoreName} from "../../types/StoreName";
import {PhotoType} from "../../types/PhotoType";
import {fetchPhoto} from "../../api/fetch/fetchPhoto";
import {CustomError} from "../errors/CustomError";
import {User} from "../StoreEntities";
import {Photo} from "../StoreEntities/Photo";
import {sendPhoto} from "../../api/fetch/sendPhoto";
import {UserService} from "./UserService";

export class PhotoService {
    static async getById(id: string) {
        let photo = await DB.getOne<PhotoType>(StoreName.Photo, id)
        try {
            if (!photo) photo = await fetchPhoto(id)
        } catch (e) {
            if (e instanceof CustomError) throw e
            console.error(e)
        }
        return photo
    }

    /**
     * метод обновляет фото пользователя в бд, оюновляет данные о пользователе и генерирует экшен
     * @param user
     * @param blob
     */
    static async updateUserPhoto(user: User, blob: Blob) {
        const photo = new Photo({blob})
        if (user.photo) photo.id = user.photo
        else user.photo = photo.id
        await UserService.update(user)
        await PhotoService.save(photo)
        await sendPhoto(user.id, blob)
        User.setPhoto(user, photo)
    }

    static async save(photo: Photo) {
        await DB.update(StoreName.Photo, photo.dto())
    }

    static async initPhoto<T extends { photo: string }>(items: T[]) {
        const photos: Photo[] = []
        for (const item of items) {
            if (item.photo) {
                const photo_type = await DB.getOne<PhotoType>(StoreName.Photo, item.photo)
                if (photo_type) photos.push(new Photo(photo_type))
            }
        }
        return photos
    }
}