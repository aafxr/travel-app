import {ExpenseFilterType, RouteFilterType} from "../../types/filtersTypes";
import {CurrencyName} from "../../types/CurrencyTypes";
import {ExtendType} from "../../types/ExtendType";
import {DBFlagType} from "../../types/DBFlagType";
import {UserSettingsType, UserType} from "../../types/UserType";
import {Member} from "./Member";
import {StoreName} from "../../types/StoreName";

type UserConstructorPropsType = Partial<UserType> | User


class User extends Member implements UserType {
    storeName = StoreName.USERS

    token = '';
    refresh_token = '';


    settings: UserSettingsType = {
        curtain: 0,
        routeFilter: "byDays",
        expensesFilter: "all",
        day: 1
    };


    currency:keyof CurrencyName = 'RUB'

    constructor(user: UserConstructorPropsType ) {
        super(user)

        if (user.photo) this.photo = user.photo
        if (user.token) this.token = user.token
        if (user.refresh_token) this.refresh_token = user.refresh_token
        if(user instanceof User) {
            if (user.settings) this.settings = user.settings
        }
    }

    dto(): UserType & ExtendType {
        return {
            id: this.id,
            username: this.username,
            first_name: this.first_name,
            last_name: this.last_name,
            photo: this.image?.id || this.photo,
            token: this.token,
            refresh_token: this.refresh_token,
            movementType: this.movementType,
            age: this.age,
            settings: this.settings
        };
    }


    static setId(user:User, id: string) {
        user.id = id
        User.setUpdate_at(user)
    }


    static setToken(user:User, token: string) {
        user.token = token
        User.setUpdate_at(user)
    }


    static setRefresh_token(user:User, refresh_token: string) {
        user.refresh_token = refresh_token
        User.setUpdate_at(user)
    }


    static getSetting<T extends keyof UserSettingsType>(user: User, key: T): UserSettingsType[T]{
        return user.settings[key]
    }


    static setRouteFilter(user:User, filter: RouteFilterType) {
        user.settings.routeFilter = filter
        User.setUpdate_at(user)
    }


    static setCurtain(user:User, isOpen: DBFlagType | boolean) {
        user.settings.curtain = isOpen ? 1 : 0
        User.setUpdate_at(user)
    }


    static setExpenseFilter(user:User, filter: ExpenseFilterType) {
        user.settings.expensesFilter = filter
        User.setUpdate_at(user)
    }


    static isLogIn(user:User) {
        if (location.hostname === 'localhost') return true
        return Boolean(user.token && user.refresh_token)
    }


    static setUpdate_at(user:User ) {
    }


}

export {User}