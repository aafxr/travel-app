import {useAppContext} from "./useAppContext";
import {useEffect, useState} from "react";
import {User} from "../../classes/StoreEntities";

export function useUser(){
    const [state, setState] = useState<{ user:User | null }>({user:null})
    const context = useAppContext()

    useEffect(() => {
        setState({user: context.user})
    }, [context.user])

     return state.user || context.user
}