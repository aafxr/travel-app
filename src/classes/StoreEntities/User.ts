import {ExpenseFilterType, RouteFilterType} from "../../types/filtersTypes";
import {CurrencyName} from "../../types/CurrencyTypes";
import {ExtendType} from "../../types/ExtendType";
import {DBFlagType} from "../../types/DBFlagType";
import {UserType} from "../../types/UserType";
import {Member} from "./Member";

type UserContructorPropsType = Partial<UserType> | User


export class User extends Member implements UserType {

    token = '';
    refresh_token = '';


    expenseFilter: ExpenseFilterType = "all"
    routeFilter: RouteFilterType = "byDays"
    curtain: DBFlagType = 0
    dayFilter: number = 1

    currency:keyof CurrencyName = 'RUB'

    constructor(user: UserContructorPropsType ) {
        super(user)

        if (user.photo) this.photo = user.photo
        if (user.token) this.token = user.token
        if (user.refresh_token) this.refresh_token = user.refresh_token
        if(user instanceof User) {
            if (user.curtain) this.curtain = user.curtain
            if (user.routeFilter) this.routeFilter = user.routeFilter
            if (user.expenseFilter) this.expenseFilter = user.expenseFilter
            if (user.dayFilter) this.dayFilter = user.dayFilter
        }
    }

    dto(): UserType & ExtendType {
        return {
            id: this.id,
            username: this.username,
            first_name: this.first_name,
            last_name: this.last_name,
            photo: this.photo,
            token: this.token,
            refresh_token: this.refresh_token,
            curtain: this.curtain,
            routeFilter: this.routeFilter,
            expenseFilter: this.expenseFilter,
            dayFilter: this.dayFilter,
            movementType: this.movementType
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

        this.setUpdate_at()
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

    setRouteFilter(filter: RouteFilterType) {
        this.routeFilter = filter
        this.setUpdate_at()
    }

    setCurtain(isOpen: DBFlagType | boolean) {
        this.curtain = isOpen ? 1 : 0
        this.setUpdate_at()
    }

    setExpenseFilter(filter: ExpenseFilterType) {
        this.expenseFilter = filter
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