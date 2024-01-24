import {nanoid} from "nanoid";

import {DBFlagType} from "../../types/DBFlagType";
import {LimitType} from "../../types/LimitType";
import {StorageEntity} from "./StorageEntity";
import {Member} from "./Member";

/**
 * Класс для работы с лимитами
 */
export class Limit extends StorageEntity implements LimitType {

    id: string
    personal: DBFlagType = 0
    section_id = ''
    value = 0
    primary_entity_id: string;



    constructor(limit: Partial<Limit | LimitType> & Pick<LimitType, 'primary_entity_id'>, user_id: string) {
        super()

        if (limit.id) this.id = limit.id
        else this.id = `${user_id}:${nanoid(7)}`

        if (limit.personal) this.personal = limit.personal
        if (limit.section_id) this.section_id = limit.section_id
        if (limit.value) this.value = limit.value
        this.primary_entity_id = limit.primary_entity_id
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
        return this.personal === 1 && this.id.split(':').pop() === user.id
    }


}