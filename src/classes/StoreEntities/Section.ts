import {SectionType} from "../../types/SectionType";
import {DBFlagType} from "../../types/DBFlagType";
import {StoreName} from "../../types/StoreName";
import storeDB from "../../db/storeDB/storeDB";
import constants from "../../static/constants";
import StorageEntity from "./StorageEntity";

/**
 * класс для работы с сущностью Section
 */
export class Section extends StorageEntity implements SectionType{
    storeName = StoreName.SECTION
    withAction = true
    
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
        return await storeDB.getAll(constants.store.SECTION)
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