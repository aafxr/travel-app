import {nanoid} from "nanoid";
import {PhotoType} from "../../types/PhotoType";
import {StoreName} from "../../types/StoreName";
import {StoreEntity} from "./StoreEntity";


/**
 * представление информации о фото в бд
 *
 * предпологается, что если представление содержит Blob,
 * то изображение еще не отправленно
 */
export class Photo extends StoreEntity implements PhotoType {
    storeName = StoreName.Photo

    blob?: Blob;
    id: string = nanoid(16);
    src: string = '';


    constructor(photo: Partial<PhotoType>) {
        super();

        if (photo.id) this.id = photo.id
        if (photo.src) this.src = photo.src
        if (photo.blob) this.blob = photo.blob

        if (this.blob && !this.src) this.src = URL.createObjectURL(this.blob)
    }

    destroy() {
        if (this.src) URL.revokeObjectURL(this.src)
    }

    toString() {
        return this.src
    }

    dto(): PhotoType {
        const data = {
            id: this.id,
            blob: this.blob,
            src: this.src,
        }
        if (data.blob) data.src = ''
        return data;
    }

}