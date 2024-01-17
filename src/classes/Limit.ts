import {nanoid} from "nanoid";
import {LimitType} from "../types/LimitType";
import {DBFlagType} from "../types/DBFlagType";

/**
 * Класс для работы с лимитами
 */
export default class Limit implements LimitType {

    id = nanoid(6)
    personal: DBFlagType = 0
    section_id = ''
    value = 0

    constructor(limit: Partial<Limit | LimitType>) {
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

}