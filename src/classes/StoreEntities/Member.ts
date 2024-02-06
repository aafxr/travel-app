import {DEFAULT_IMG_URL} from "../../static/constants";
import {MovementType} from "../../types/MovementType";
import {MemberType} from "../../types/MemberType";
import {StoreName} from "../../types/StoreName";
import {StoreEntity} from "./StoreEntity";
import {Photo} from "./Photo";


/**
 * представление пользователя приложения
 *
 * Содержит поля:
 *
 * __id__,
 * __username__,
 * __first_name__,
 * __last_name__,
 * __photo__,
 * __movementType__,
 * __age__,
 */
export class Member extends StoreEntity implements MemberType {
    storeName = StoreName.USERS

    id = '';
    username = '';
    first_name = '';
    last_name = '';
    photo: string = '';
    image?: Photo
    age: number = 18;


    movementType: MovementType[] = [MovementType.CAR];


    constructor(member: Partial<MemberType> | Member) {
        super();

        if (member.id) this.id = member.id
        if (member.username) this.username = member.username
        if (member.first_name) this.first_name = member.first_name
        if (member.last_name) this.last_name = member.last_name
        if (member.movementType) this.movementType = member.movementType
        if (member.photo) this.photo = member.photo

        if(member instanceof Member){
            if (member.image) this.setPhoto(member.image)
        }
    }


    get isChild() {
        return this.age < 18
    }


    setUsername(username: string) {
        this.username = username
        this.update()
    }


    setFirst_name(first_name: string) {
        this.first_name = first_name
        this.update()
    }


    setLast_name(last_name: string) {
        this.last_name = last_name
        this.update()
    }


    setPhoto(photo: Photo) {
        if (this.photo) photo.id = this.photo
        else this.photo = photo.id

        this.image?.destroy()
        this.image = photo
        this.update()
    }


    setAge(age: number) {
        this.age = age
        this.update()
    }


    update() {
        this.emit('update', [this])
    }


    get getPhotoURL() {
        if (this.image) return this.image.toString()
        return DEFAULT_IMG_URL
    }


    dto(): { id: string; [p: string]: any } {
        return {
            id: this.id,
            username: this.username,
            first_name: this.first_name,
            last_name: this.last_name,
            photo: this.image?.id || this.photo,
        };
    }


}