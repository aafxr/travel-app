import {DB} from "../db/DB";
import {fetchSections} from "../../api/fetch/fetchSections";
import {SectionType} from "../../types/SectionType";
import {StoreName} from "../../types/StoreName";
import {Section} from "../StoreEntities";


/**
 * сервис для загрузки информации о секциях
 *
 * ---
 * доступны следующие методы:
 * - getSectionById
 * - getAll
 */
export class SectionService {

    /**
     * метод для загрузки информации о секции из бд
     * @param section_id
     */
    static async getSectionById(section_id: string) {
        const sectionObj = await DB.getOne<SectionType>(StoreName.SECTION, section_id)
        if (sectionObj) return new Section(sectionObj)

        const sections = await fetchSections()
        await DB.writeAllToStore(StoreName.SECTION, sections)
        return sections.find(s => s.id === section_id)
    }

    /**
     * метод загружает информацию о секции из бд или формирует запрос к api
     */
    static async getAll() {
        const sectionsObj = await DB.getAll<SectionType>(StoreName.SECTION)
        if (sectionsObj.length) return sectionsObj.map(s => new Section(s))

        const sections = await fetchSections()
        await DB.writeAllToStore(StoreName.SECTION, sections)
        return sections
    }
}