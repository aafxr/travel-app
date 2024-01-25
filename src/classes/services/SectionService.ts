import {DB} from "../db/DB";
import {fetchSections} from "../../api/fetch/fetchSections";
import {SectionType} from "../../types/SectionType";
import {StoreName} from "../../types/StoreName";
import {Section} from "../StoreEntities";

export class SectionService {

    static async getSectionById(section_id: string) {
        const sectionObj = await DB.getOne<SectionType>(StoreName.SECTION, section_id)
        if (sectionObj) return new Section(sectionObj)

        const sections = await fetchSections()
        await DB.writeAll(sections)
        return sections.find(s => s.id === section_id)
    }

    static async getAll(){
         const sectionsObj = await DB.getAll<SectionType>(StoreName.SECTION)
        if(sectionsObj.length) return sectionsObj.map(s => new Section(s))

        const sections = await fetchSections()
        await DB.writeAll(sections)
        return sections
    }
}