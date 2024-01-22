import {StoreName} from "../../types/StoreName";
import {UserType} from "../../types/UserType";
import {StorageEntity} from "./StorageEntity";

export class User extends StorageEntity implements UserType{
    storeName: StoreName = StoreName.USERS;
    withAction = false

    id = '';
    username = '';
    first_name = '';
    last_name = '';
    photo = '';
    token = '';
    refresh_token = '';

    constructor(user: Partial<UserType | User>) {
        super()

        if (user.id) this.id = user.id
        if (user.username) this.username = user.username
        if (user.first_name) this.first_name = user.first_name
        if (user.last_name) this.last_name = user.last_name
        if (user.photo) this.photo = user.photo
        if (user.token) this.token = user.token
        if (user.refresh_token) this.refresh_token = user.refresh_token
    }

    dto(): UserType {
        return {
            id: this.id,
            username: this.username,
            first_name: this.first_name,
            last_name: this.last_name,
            photo: this.photo,
            token: this.token,
            refresh_token: this.refresh_token,
        };
    }

    setId(id: string){
        this.id = id
        this.emit('update')
    }

    setUsername(username: string){
        this.username = username
        this.emit('update')
    }

    setFirst_name(first_name: string){
        this.first_name = first_name
        this.emit('update')
    }

    setLast_name(last_name: string){
        this.last_name = last_name
        this.emit('update')
    }

    setPhoto(photo: string){
        this.photo = photo
        this.emit('update')
    }

    setToken(token: string){
        this.token = token
        this.emit('update')
    }

    setRefresh_token(refresh_token: string){
        this.refresh_token = refresh_token
        this.emit('update')
    }

}