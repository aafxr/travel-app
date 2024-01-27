import {useEffect, useState} from "react";
import {StoreEntity} from "../classes/StoreEntities";

export function useCloneStoreEntity<T extends StoreEntity>(init: T) {
    const [state, setState] = useState<{ item: T | null, change: boolean }>({item: null, change: false})

    useEffect(() => {
        const clone = init.clone()
        const unsub = clone.subscribe('update', () => {
            setState(prev => {
                if (!prev.change) prev.change = true
                return {...prev}
            })
        })
        setState({item: clone, change: false})
        return () => unsub()
    }, [])

    return state
}