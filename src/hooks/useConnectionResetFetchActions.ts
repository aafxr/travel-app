import {useEffect} from "react";

import defaultHandleError from "../utils/error-handlers/defaultHandleError";
import {ActionService} from "../classes/services/ActionService";
import {useAppContext} from "../contexts/AppContextProvider";
import {Action} from "../classes/StoreEntities";
import {StoreName} from "../types/StoreName";
import {TravelService} from "../classes/services";


type FetchActionsHookOptions = {
    onTravelAction?: (ids: string[]) => unknown
    onExpenseAction?: (ids: string[]) => unknown
    onLimitAction?: () => unknown
    onMessageAction?: () => unknown
    onUserAction?: () => unknown
}


/**
 * хук добавляет слушатель события __window.addEventListener('online', ...)__
 *
 * если передать в хук options.callback, то этот callback будет вызван, если будет получен action
 * с  соответствующим entity
 *
 *
 * @param options - набор callback-опций
 */
export function useConnectionResetFetchActions(options: FetchActionsHookOptions = {}) {
    const context = useAppContext()


    useEffect(() => {
        async function onOnline() {
            const actions: Action<any>[] = await ActionService.checkForNewActions().catch(defaultHandleError) || []

            const map = new Map<string, Action<any>[]>()
            actions.forEach(a => {
                const list = map.get(a.entity) || []
                list.push(a)
            })

            if(options.onTravelAction && map.has(StoreName.TRAVEL)) {
                const ids: string[] = map.get(StoreName.TRAVEL)!.map(a => a.data.id)
                options.onTravelAction(ids)
            }

            if(options.onExpenseAction && (map.has(StoreName.EXPENSES_ACTIONS) || map.has(StoreName.EXPENSES_PLAN))) {
                const set = new Set<string>()
                if(map.has(StoreName.EXPENSES_ACTIONS)){
                    map.get(StoreName.EXPENSES_ACTIONS)!.forEach(a => set.add(a.data.primary_entity_id))
                }
                if(map.has(StoreName.EXPENSES_PLAN)){
                    map.get(StoreName.EXPENSES_PLAN)!.forEach(a => set.add(a.data.primary_entity_id))
                }
                const travel_ids = Array.from(set.keys())
                if(travel_ids.length) options.onExpenseAction(travel_ids)
            }

            if(options.onLimitAction && map.has(StoreName.LIMIT)) options.onLimitAction()
            if(options.onUserAction && map.has(StoreName.USERS)) options.onUserAction()
            if(options.onMessageAction && map.has(StoreName.MESSAGE)) options.onMessageAction()

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