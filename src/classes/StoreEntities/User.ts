import {TravelDetailsFilterType} from "../../types/TravelFilterTypes";
import {DBFlagType} from "../../types/DBFlagType";
import {UserType} from "../../types/UserType";
import {TravelEventName} from "./Travel";
import {Member} from "./Member";

const TRAVEL_DETAILS_FILTER = 'TRAVEL_DETAILS_FILTER'

export class User extends Member implements UserType {

    travelDetailsFilter: TravelDetailsFilterType = localStorage.getItem(TRAVEL_DETAILS_FILTER) as TravelDetailsFilterType || "byDays"
    token = '';
    refresh_token = '';
    isCurtainOpen: DBFlagType = 0

    constructor(user: Partial<UserType | User>) {
        super(user)

        if (user.photo) this.photo = user.photo
        if (user.token) this.token = user.token
        if (user.refresh_token) this.refresh_token = user.refresh_token
        if (user.isCurtainOpen) this.isCurtainOpen = user.isCurtainOpen
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
            travelDetailsFilter: this.travelDetailsFilter,
            isCurtainOpen: this.isCurtainOpen
        };
    }

    setPhoto(photo: string | Blob) {
        if (this.imageURL && this.photo instanceof Blob) URL.revokeObjectURL(this.imageURL)

        this.photo = photo
        if (photo instanceof Blob)
            this.imageURL = URL.createObjectURL(photo)
        else {
            this.imageURL = photo
        }

        this.emit(TravelEventName.UPDATE)
    }

    setId(id: string) {
        this.id = id
        this.emit('update')
    }

    setUsername(username: string) {
        this.username = username
        this.emit('update')
    }

    setFirst_name(first_name: string) {
        this.first_name = first_name
        this.emit('update')
    }

    setLast_name(last_name: string) {
        this.last_name = last_name
        this.emit('update')
    }

    setToken(token: string) {
        this.token = token
        this.emit('update')
    }

    setRefresh_token(refresh_token: string) {
        this.refresh_token = refresh_token
        this.emit('update')
    }

    setTravelDetailsFilter(filter: TravelDetailsFilterType) {
        this.travelDetailsFilter = filter
        console.log(this)
        this.emit('update')
    }

    setCurtainOpen(isOpen: DBFlagType | boolean) {
        this.isCurtainOpen = isOpen ? 1 : 0
        this.emit('update')
    }

    isLogIn(){
        if(location.hostname === 'localhost') return true
        return Boolean(this.token && this.refresh_token)
    }

}