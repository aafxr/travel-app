import {Travel} from "../classes/StoreEntities";
import {TravelType} from "../types/TravelType";
import {useEffect, useState} from "react";

export type UseTravelStateType = {
    travel: TravelType
    change: boolean
}

type useTravelStateReturnType = [UseTravelStateType | undefined, (state: UseTravelStateType) => unknown]

interface InitFunctionType {
    (travel: TravelType): Partial<TravelType>
}

type  InitialStateType = Partial<TravelType> | InitFunctionType

export function useTravelState(travel: Travel | undefined | null, initialize?: InitialStateType): useTravelStateReturnType {
    const [state, setState] = useState<UseTravelStateType>()
    const updateState = (update: UseTravelStateType) => {
        if (!update.change) update.change = true
        setState(update)
    }

    useEffect(() => {
        if (!travel) return

        const newState = travel.dto()
        if (initialize) {
            if (typeof initialize === 'function')
                Object.assign(newState, initialize(travel))
            else
                Object.assign(newState, initialize)
        }
        setState({travel: newState, change: false})
    }, [travel])

    return [state, updateState]
}