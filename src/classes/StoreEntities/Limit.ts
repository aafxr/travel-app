import {DBFlagType} from "../../types/DBFlagType";
import {LimitType} from "../../types/LimitType";
import {StoreEntity} from "./StoreEntity";
import {Member} from "./Member";
import {User} from "./User";
import {StoreName} from "../../types/StoreName";

interface LimitOptionsType extends Partial<LimitType> {
    id:string
    section_id:string
    primary_entity_id:string
}

/**
 * Класс для работы с лимитами
 */
export class Limit extends StoreEntity implements LimitType {
    storeName = StoreName.LIMIT

    id: string
    personal: DBFlagType = 0
    section_id = ''
    value = 0
    primary_entity_id: string;

    user: User



    constructor(options: LimitOptionsType, user: User) {
        super()

        this.user = user
        this.id = options.id

        if (options.personal) this.personal = options.personal
        this.section_id = options.section_id
        if (options.value) this.value = options.value
        this.primary_entity_id = options.primary_entity_id
    }



    setPersonal(personal: DBFlagType) {
        this.personal = personal
    }

    setSection_id(section_id: string) {
        this.section_id = section_id
    }

    setValue(value: number) {
        this.value = value
    }

    valueOf() {
        return this.value
    }

    dto(): LimitType {
        return {
            id: this.id,
            personal: this.personal,
            section_id: this.section_id,
            value: this.value,
            primary_entity_id: this.primary_entity_id
        };
    }

    isPersonal<T extends Member>(user: T) {
        return this.personal === 1 && this.id.startsWith(user.id)
    }


}