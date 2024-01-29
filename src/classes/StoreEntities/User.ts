import {ExpenseFilterType, RouteFilterType} from "../../types/filtersTypes";
import {CurrencyName} from "../../types/CurrencyTypes";
import {ExtendType} from "../../types/ExtendType";
import {DBFlagType} from "../../types/DBFlagType";
import {UserSettingsType, UserType} from "../../types/UserType";
import {Member} from "./Member";

type UserConstructorPropsType = Partial<UserType> | User


export class User extends Member implements UserType {

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


    setId(id: string) {
        this.id = id
        this.setUpdate_at()
    }


    setUsername(username: string) {
        this.username = username
        this.setUpdate_at()
    }


    setFirst_name(first_name: string) {
        this.first_name = first_name
        this.setUpdate_at()
    }


    setLast_name(last_name: string) {
        this.last_name = last_name
        this.setUpdate_at()
    }


    setToken(token: string) {
        this.token = token
        this.setUpdate_at()
    }


    setRefresh_token(refresh_token: string) {
        this.refresh_token = refresh_token
        this.setUpdate_at()
    }


    getSetting<T extends keyof UserSettingsType>(key: T): UserSettingsType[T]{
        return this.settings[key]
    }


    setRouteFilter(filter: RouteFilterType) {
        this.settings.routeFilter = filter
        this.setUpdate_at()
    }


    setCurtain(isOpen: DBFlagType | boolean) {
        this.settings.curtain = isOpen ? 1 : 0
        this.setUpdate_at()
    }


    setExpenseFilter(filter: ExpenseFilterType) {
        this.settings.expensesFilter = filter
        this.setUpdate_at()
    }


    isLogIn() {
        if (location.hostname === 'localhost') return true
        return Boolean(this.token && this.refresh_token)
    }


    setUpdate_at(){
        this.emit('update', [this])
    }


}