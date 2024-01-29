import {StoreEntity} from "./StoreEntity";
import {PhotoType} from "../../types/PhotoType";
import {nanoid} from "nanoid";


export class Photo extends StoreEntity implements PhotoType {
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

    toString(){
        return this.src
    }

    dto(): PhotoType {
        return {
            id: this.id,
            blob: this.blob,
            src: this.src,
        };
    }

}