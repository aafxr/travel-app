import {StoreName} from "../../types/StoreName";
import {StoreEntity} from "./StoreEntity";
import {MemberType} from "../../types/MemberType";

export class Member extends StoreEntity implements MemberType {
    storeName: StoreName = StoreName.USERS;
    withAction = false

    id = '';
    username = '';
    first_name = '';
    last_name = '';
    photo: string | Blob = '';
    imageURL = ''

    constructor(member: Partial<MemberType> | Member) {
        super();

        if (member.id) this.id = member.id
        if (member.username) this.username = member.username
        if (member.first_name) this.first_name = member.first_name
        if (member.last_name) this.last_name = member.last_name
        if (member.photo) {
            this.photo = member.photo
            if (typeof this.photo === "string")
                this.imageURL = this.photo
        }
    }

    dto(): { id: string; [p: string]: any } {
        return {
            id: this.id,
            username: this.username,
            first_name: this.first_name,
            last_name: this.last_name,
            photo: this.photo,
        };
    }
}