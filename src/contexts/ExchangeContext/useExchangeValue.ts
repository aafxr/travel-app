import {useContext} from "react";

import {ExchangeContext} from "./ExchangeContextProvider";
import {useUser} from "../AppContextProvider";
import {CurrencyName} from "./CurrencyTypes";

/**
 * хук принимает дату, и возвращает коэффициент в соответствии с текущей выбранной валютой пользователя.
 *
 * Если если нет курса валют на данную дату, возвращает 1
 *
 * по умолчанию возвращает 1
 * @param date
 * @param currency
 */
export function useExchangeCoefficient(date:Date, currency: keyof CurrencyName){
    const user = useUser()
    const exchange = useContext(ExchangeContext)

    if(!user) return 1

    const d = date.toLocaleDateString()
    if(exchange[d]){
        const ec = exchange[d].find(e => e.char_code === currency)
        const uc = exchange[d].find(e => e.char_code === user.currency)
        if(uc && ec)
            return ec.value * uc.value
    }

    return 1
}