import {Travel} from "../classes/StoreEntities";
import {useEffect, useState} from "react";

export type UseTravelStateType = {
    travel: Travel
    change: boolean
}

type useTravelStateReturnType = [UseTravelStateType | undefined, (state: UseTravelStateType) => unknown]

interface InitFunctionType {
    (travel: Travel): Partial<Travel>
}

type  InitialStateType = Partial<Travel> | InitFunctionType

export function useTravelState(travel: Travel | undefined | null, initialize?: InitialStateType): useTravelStateReturnType {
    const [state, setState] = useState<UseTravelStateType>()
    const updateState = (update: UseTravelStateType) => {
        if (!update.change) update.change = true
        setState(update)
    }

    useEffect(() => {
        if (!travel) return

        const newState = new Travel(travel)
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