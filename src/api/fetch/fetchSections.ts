import aFetch from "../../axios";
import {SectionType} from "../../types/SectionType";
import {Section} from "../../classes/StoreEntities";

type SectionAPIResponse = {
    ok: boolean
    data: SectionType[]
}

export async function fetchSections() {
    try {
        const response = (await aFetch<SectionAPIResponse>('/expenses/getSections/')).data
        if (response.ok) {
            return response.data.map(s => new Section(s))
        }
        return []
    } catch (e) {
        return []
    }
}