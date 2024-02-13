import {DBFlagType} from "../../types/DBFlagType";
import {LimitType} from "../../types/LimitType";
import {Member} from "./Member";
import {User} from "./User";

interface LimitOptionsType extends Partial<LimitType> {
    id:string
    section_id:string
    primary_entity_id:string
}

/**
 * Класс для работы с лимитами
 *
 * id лимита формируется как:
 * - "section_id:primary_entity_id" для общих лимитов
 * - "user_id:section_id:primary_entity_id" для общих личных
 *
 * Содержи поля:
 *
 * __id__,
 * __personal__,
 * __section_id__,
 * __value__,
 * __primary_entity_id__
 */
export class Limit {

    id: string
    personal: DBFlagType = 0
    section_id = ''
    value = 0
    primary_entity_id: string;

    user: User



    constructor(options: LimitOptionsType, user: User) {
        this.user = user
        this.id = options.id

        if (options.personal) this.personal = options.personal
        this.section_id = options.section_id
        if (options.value) this.value = options.value
        this.primary_entity_id = options.primary_entity_id
    }



    static setPersonal(limit: Limit, personal: DBFlagType) {
        limit.personal = personal
    }

    static setSection_id(limit: Limit, section_id: string) {
        limit.section_id = section_id
    }

    static setValue(limit: Limit, value: number) {
        limit.value = value
    }

    valueOf() {
        return this.value
    }

    static isPersonal<T extends Member>(limit: Limit, user: T) {
        return limit.personal === 1 && limit.id.startsWith(user.id)
    }


}