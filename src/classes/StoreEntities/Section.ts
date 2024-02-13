import {SectionType} from "../../types/SectionType";
import {DBFlagType} from "../../types/DBFlagType";
import {StoreName} from "../../types/StoreName";
import {DB} from "../db/DB";

/**
 * класс для работы с сущностью Section
 *
 * Содержит поля:
 *
 * __id__
 * __color__
 * __title__
 * __hidden__
 *
 */
export class Section{

    id = '';
    color = '';
    title = '';
    hidden: DBFlagType = 0;

    constructor(section: Partial<SectionType> | Section) {
        if (section.id) this.id = section.id
        if (section.color) this.color = section.color
        if (section.title) this.title = section.title
        if (section.hidden) this.hidden = section.hidden
    }

    static setColor(section : Section, color: string) {
        section.color = color
    }

    static setTitle(section : Section, title: string) {
        section.title = title
    }

    static setHidden(section : Section, hidden: DBFlagType) {
        section.hidden = hidden
    }

    static async defaultSections(){
        return await DB.getAll(StoreName.SECTION)

    }
}