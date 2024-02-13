import {nanoid} from "nanoid";


/**
 * представление информации о фото в бд
 *
 * предпологается, что если представление содержит Blob,
 * то изображение еще не отправленно
 *
 *
 * Содержит поля:
 *
 * __id__,
 * __src__,
 * __blob__(опционально)
 *
 */
export class Photo {

    blob?: Blob;
    id: string = nanoid(16);
    src: string = '';
    blobUrl = ''


    constructor(photo: Partial<Photo>) {
        if (photo.id) this.id = photo.id
        if (photo.src) this.src = photo.src
        if (photo.blob) this.blob = photo.blob

        if (photo.destroy) photo.destroy()

        if (this.blob && !this.src) this.blobUrl = URL.createObjectURL(this.blob)
    }

    destroy() {
            if (this.blobUrl) {
            URL.revokeObjectURL(this.blobUrl)
            this.blobUrl = ''
        }
    }

    toString() {
        return this.src || this.blobUrl
    }
}