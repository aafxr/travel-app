import aFetch from "../../axios";
import {CurrencyType} from "../../types/CurrencyTypes";

type APICurrencyResponseType = {
    [key: string]: CurrencyType<any>[]
}

export async function fetchExchangeCourse(start: number, end: number) {
    const payload = {
        date_start: new Date(start).toLocaleDateString(),
        date_end: new Date(end).toLocaleDateString()
    }
    return (await aFetch.post<APICurrencyResponseType>('/main/currency/getList/', payload)).data
}