import {StoreEntity} from "./StoreEntity";
import {MemberType} from "../../types/MemberType";
import {MovementType} from "../../types/MovementType";

export class Member extends StoreEntity implements MemberType {

    id = '';
    username = '';
    first_name = '';
    last_name = '';
    photo: string | Blob = '';
    imageURL = ''
    age: number = 18;



    movementType: MovementType[] = [MovementType.CAR];


    constructor(member: Partial<MemberType> | Member) {
        super();

        if (member.id) this.id = member.id
        if (member.username) this.username = member.username
        if (member.first_name) this.first_name = member.first_name
        if (member.last_name) this.last_name = member.last_name
        if(member.movementType) this.movementType = member.movementType
        if (member.photo) {
            this.photo = member.photo
            if (typeof this.photo === "string")
                this.imageURL = this.photo
        }
    }


    get isChild() {
        return this.age < 18
    }


    setUsername(username: string){
        this.username = username
        this.update()
    }
    setFirst_name(first_name: string){
        this.first_name = first_name
        this.update()
    }
    setLast_name(last_name: string){
        this.last_name = last_name
        this.update()
    }
    setPhoto(photo: string){
        this.photo = photo
        this.update()
    }
    setImageURL(imageURL: string){
        this.imageURL = imageURL
        this.update()
    }
    setAge(age: number){
        this.age = age
        this.update()
    }


    update(){
        this.emit('update',[this])
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