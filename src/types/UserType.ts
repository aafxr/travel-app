import {MemberType} from "./MemberType";
import {TravelDetailsFilterType} from "./TravelFilterTypes";
import {DBFlagType} from "./DBFlagType";

/** Тип, описывающий данные пользователя */
export interface UserType extends MemberType {
    token: string,
    refresh_token: string,
}