import {DEFAULT_IMG_URL} from "../../static/constants";
import {MovementType} from "../../types/MovementType";
import {MemberType} from "../../types/MemberType";
import {StoreEntity} from "./StoreEntity";
import {Photo} from "./Photo";
import {StoreName} from "../../types/StoreName";

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
            if (member.image) Member.setPhoto(this, member.image)
        }
    }


    static isChild<T extends Member>(member: T) {
        return member.age < 18
    }


    static setUsername<T extends Member>(member: T, username: string) {
        member.username = username
        Member.update(member)
    }


    static setFirst_name<T extends Member>(member: T, first_name: string) {
        member.first_name = first_name
        Member.update(member)
    }


    static setLast_name<T extends Member>(member: T, last_name: string) {
        member.last_name = last_name
        Member.update(member)
    }


    static setPhoto<T extends Member>(member: T, photo: Photo) {
        if (member.photo) photo.id = member.photo
        else member.photo = photo.id

        member.image?.destroy()
        member.image = photo
        Member.update(member)
    }


    static setAge<T extends Member>(member: T, age: number) {
        member.age = age
        Member.update(member)
    }


    static update<T extends Member>(member: T) {
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