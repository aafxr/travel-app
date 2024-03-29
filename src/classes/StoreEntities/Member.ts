import {DEFAULT_IMG_URL} from "../../static/constants";
import {MovementType} from "../../types/MovementType";
import {MemberType} from "../../types/MemberType";
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
export class Member {

    id = '';
    username = '';
    first_name = '';
    last_name = '';
    photo: string = '';
    image?: Photo
    age: number = 18;


    movementType: MovementType[] = [MovementType.CAR];


    constructor(member: Partial<MemberType> | Member) {
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
    }


    setFirst_name(first_name: string) {
        this.first_name = first_name
    }


    setLast_name(last_name: string) {
        this.last_name = last_name
    }


    setPhoto(photo: Photo) {
        if (this.photo) photo.id = this.photo
        else this.photo = photo.id

        this.image?.destroy()
        this.image = photo
    }


    setAge(age: number) {
        this.age = age
    }

    get getPhotoURL() {
        if (this.image) return this.image.toString()
        return DEFAULT_IMG_URL
    }
}