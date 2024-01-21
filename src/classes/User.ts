import {UserType} from "../types/UserType";
import {WithDTOMethod} from "../types/WithDTOMethod";
import {WithStoreProps} from "../types/WithStoreProps";
import {StoreName} from "../types/StoreName";

export class User implements UserType, WithDTOMethod, WithStoreProps {
    storeName: StoreName = StoreName.USERS;
    withAction = true

    id = '';
    username = '';
    first_name = '';
    last_name = '';
    photo = '';
    token = '';
    refresh_token = '';

    constructor(user: Partial<UserType | User>) {
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
}