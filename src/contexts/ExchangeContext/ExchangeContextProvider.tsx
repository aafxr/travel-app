import {Outlet} from "react-router-dom";
import {createContext, useEffect, useState} from "react";

import defaultHandleError from "../../utils/error-handlers/defaultHandleError";
import {ExchangeService} from "../../classes/services/ExchangeService";
import {ExchangeType} from "./ExchangeType";
import {useTravel} from "../AppContextProvider";

type ExchangeContextType = { [key: string]: ExchangeType['value'] }

export const ExchangeContext = createContext<ExchangeContextType>({})

export function ExchangeContextProvider() {
    const travel = useTravel()
    const [state, setState] = useState<ExchangeContextType>({})


    useEffect(() => {
        if(!travel) return
        ExchangeService.getExchangeCourse(travel.date_start, travel.date_end)
            .then(setState)
            .catch(defaultHandleError)
    }, [travel])

    return (
        <ExchangeContext.Provider value={state}>
            <Outlet/>
        </ExchangeContext.Provider>
    )
}