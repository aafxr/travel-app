import aFetch from "../../axios";
import {SectionType} from "../../types/SectionType";
import {Section} from "../../classes/StoreEntities";

export async function fetchSections() {
    try {
        const sections = (await aFetch<SectionType[]>('/expenses/getSections/')).data || []
        return sections.map(s => new Section(s))
    } catch (e) {
        return []
    }
}