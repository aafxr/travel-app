import {SectionType} from "../../types/SectionType";
import {DBFlagType} from "../../types/DBFlagType";
import {StoreName} from "../../types/StoreName";
import {StoreEntity} from "./StoreEntity";
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
export class Section extends StoreEntity implements SectionType{
    storeName = StoreName.SECTION

    id = '';
    color = '';
    title = '';
    hidden: DBFlagType = 0;

    constructor(section: Partial<SectionType> | Section) {
        super()

        if (section.id) this.id = section.id
        if (section.color) this.color = section.color
        if (section.title) this.title = section.title
        if (section.hidden) this.hidden = section.hidden
    }

    setColor(color: string) {
        this.color = color
    }

    setTitle(title: string) {
        this.title = title
    }

    setHidden(hidden: DBFlagType) {
        this.hidden = hidden
    }

    static async defaultSections(){
        return await DB.getAll(StoreName.SECTION)

    }

    dto(): SectionType {
        return {
            id: this.id,
            color: this.color,
            title: this.title,
            hidden: this.hidden,
        };
    }

}