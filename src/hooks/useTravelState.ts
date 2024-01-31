import {Travel} from "../classes/StoreEntities";
import {TravelType} from "../types/TravelType";
import {useEffect, useState} from "react";

type TravelStateType = {
    travel: TravelType
    change: boolean
}

type useTravelStateReturnType = [TravelStateType | undefined, (state: TravelStateType) => unknown]

export function useTravelState(travel: Travel | undefined | null): useTravelStateReturnType {
    const [state, setState] = useState<TravelStateType>()
    const updateState = (update: TravelStateType) => {
        if (!update.change) update.change = true
        setState(update)
    }

    useEffect(() => {
        if (!travel) return
        setState({travel: travel.dto(), change: false})
    }, [travel])

    return [state, updateState]
}