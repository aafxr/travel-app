import {User} from "../classes/StoreEntities";
import {useEffect, useState} from "react";
import {UserType} from "../types/UserType";

type UserStateType = {
    user: User
    change: boolean
}

type useUserStateReturnType = [UserStateType | undefined, (state: UserStateType) => unknown]

export function useUserState(user: User | undefined | null, initialize?: Partial<UserType>): useUserStateReturnType {
    const [state, setState] = useState<UserStateType>()
    const updateState = (update: UserStateType) => {
        if (!update.change) update.change = true
        setState(update)
    }

    useEffect(() => {
        if (!user) return

        const newState = new User(user)
        if (initialize)
            Object.assign(newState, initialize)
        setState({user: newState, change: false})
    }, [user])

    return [state, updateState]
}