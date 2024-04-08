import {useEffect} from "react";

import defaultHandleError from "../utils/error-handlers/defaultHandleError";
import {ActionService} from "../classes/services/ActionService";
import {useAppContext} from "../contexts/AppContextProvider";
import {Action} from "../classes/StoreEntities";
import {StoreName} from "../types/StoreName";
import {TravelService} from "../classes/services";


type FetchActionsHookOptions = {
    onTravelAction?: () => unknown
    onExpenseAction?: () => unknown
    onLimitAction?: () => unknown
    onMessageAction?: () => unknown
    onUserAction?: () => unknown
}


export function useConnectionResetFetchActions(options: FetchActionsHookOptions = {}) {
    const context = useAppContext()



    useEffect(() => {
        async function onOnline() {
            const travel = context.travel
            if (!travel) return

            const actions: Action<any>[] = await ActionService.checkForNewActions().catch(defaultHandleError) || []

            const entities = actions.map(a => a.entity)
            const set = new Set(entities)

            if(options.onTravelAction && set.has(StoreName.TRAVEL)) options.onTravelAction()
            if(options.onExpenseAction && (set.has(StoreName.EXPENSES_ACTIONS) || set.has(StoreName.EXPENSES_ACTIONS))) options.onExpenseAction()
            if(options.onLimitAction && set.has(StoreName.LIMIT)) options.onLimitAction()
            if(options.onUserAction && set.has(StoreName.USERS)) options.onUserAction()
            if(options.onMessageAction && set.has(StoreName.MESSAGE)) options.onMessageAction()

            const currentTravelAction = actions.find(a => a.entity === StoreName.TRAVEL && a.data.id === context.travel?.id)
            if(currentTravelAction) {
                const _t = await TravelService.getById(currentTravelAction?.id)
                if(_t) context.setTravel(_t)
            }
        }

        window.addEventListener('online', onOnline)
        return () => window.removeEventListener('online', onOnline)
    }, [])

}