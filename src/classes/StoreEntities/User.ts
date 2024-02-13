import {ExpenseFilterType, RouteFilterType} from "../../types/filtersTypes";
import {CurrencyName} from "../../types/CurrencyTypes";
import {DBFlagType} from "../../types/DBFlagType";
import {UserSettingsType} from "../../types/UserType";
import {Member} from "./Member";
import {StoreName} from "../../types/StoreName";

type UserConstructorPropsType = Partial<User>

/**
 * представление пользователя приложения
 * дополняет класс Member полями:
 * - token
 * - refresh_token
 * - settings текущие выбранные настройки / фильтры пользователя
 *
 * Содержит поля:
 *
 * __id__,
 * __username__,
 * __first_name__,
 * __last_name__,
 * __photo__,
 * __token__,
 * __refresh_token__,
 * __movementType__,
 * __age__,
 * __settings__
 *
 *
 * @class User
 * @extends Member
 */
export class User extends Member {
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

    static setId(user: User, id: string) {
        user.id = id
    }


    static setUsername(user: User, username: string) {
        user.username = username
    }


    static setFirst_name(user: User, first_name: string) {
        user.first_name = first_name
    }


    static setLast_name(user: User, last_name: string) {
        user.last_name = last_name
    }


    static setToken(user: User, token: string) {
        user.token = token
    }


    static setRefresh_token(user: User, refresh_token: string) {
        user.refresh_token = refresh_token
    }


    static getSetting<T extends keyof UserSettingsType>(user: User, key: T): UserSettingsType[T]{
        return user.settings[key]
    }


    static setRouteFilter(user: User, filter: RouteFilterType) {
        user.settings.routeFilter = filter
    }


    static setCurtain(user: User, isOpen: DBFlagType | boolean) {
        user.settings.curtain = isOpen ? 1 : 0
    }


    static setExpenseFilter(user: User, filter: ExpenseFilterType) {
        user.settings.expensesFilter = filter
    }


    static isLogIn(user: User) {
        if (location.hostname === 'localhost') return true
        return Boolean(user.token && user.refresh_token)
    }
}