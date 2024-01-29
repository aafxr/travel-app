import {MemberType} from "./MemberType";
import {DBFlagType} from "./DBFlagType";
import {ExpenseFilterType, RouteFilterType} from "./filtersTypes";

/** Тип, описывающий данные пользователя */
export interface UserType extends MemberType {
    token: string,
    refresh_token: string,
    settings: UserSettingsType
}

export type UserSettingsType = {
    curtain: DBFlagType,
    expensesFilter: ExpenseFilterType,
    routeFilter: RouteFilterType,
    day: number
}