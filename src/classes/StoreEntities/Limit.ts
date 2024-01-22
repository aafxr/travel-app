import {nanoid} from "nanoid";

import {DBFlagType} from "../../types/DBFlagType";
import {StoreName} from "../../types/StoreName";
import {LimitType} from "../../types/LimitType";
import {StorageEntity} from "./StorageEntity";

/**
 * Класс для работы с лимитами
 */
export class Limit extends StorageEntity implements LimitType {
    storeName = StoreName.LIMIT
    withAction = true

    id = nanoid(6)
    personal: DBFlagType = 0
    section_id = ''
    value = 0

    constructor(limit: Partial<Limit | LimitType>) {
        super()

        if (limit.id) this.id = limit.id
        if (limit.personal) this.personal = limit.personal
        if (limit.section_id) this.section_id = limit.section_id
        if (limit.value) this.value = limit.value
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

    valueOf(){
        return this.value
    }

    dto(): LimitType {
        return {
            id: this.id,
            personal: this.personal,
            section_id: this.section_id,
            value: this.value,
        };
    }

}