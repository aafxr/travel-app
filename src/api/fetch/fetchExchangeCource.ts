import aFetch from "../../axios";
import {CurrencyType} from "../../types/CurrencyTypes";

// type APICurrencyResponseType = {
//     [key: string]: CurrencyType<any>[]
// }

type APICurrencyResponce = {
    ok: boolean,
    data:{
        [key:string]: CurrencyType<any>[]
    }
}

export async function fetchExchangeCourse(start: Date, end: Date) {
    const payload = {
        date_start: start.toLocaleDateString(),
        date_end: end.toLocaleDateString()
    }
    const response = (await aFetch.post<APICurrencyResponce>('/main/currency/getList/', payload)).data
    if (response.ok) return response.data
    return {}
}