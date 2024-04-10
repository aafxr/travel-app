import {Outlet} from "react-router-dom";

import {useConnectionResetFetchActions} from "../../hooks/useConnectionResetFetchActions";
import {useAppContext, useTravel, useUser} from "../../contexts/AppContextProvider";
import {Action, Travel} from "../../classes/StoreEntities";
import {Recover} from "../../classes/Recover";
import {useEffect} from "react";
import {ActionService} from "../../classes/services/ActionService";
import defaultHandleError from "../../utils/error-handlers/defaultHandleError";
import {StoreName} from "../../types/StoreName";
import {TravelService} from "../../classes/services";
import {useActionSubject} from "../../contexts/ActionSubjectContextProvider";


/**
 * компонент добавляет логику загрузки actions с сервера при востановлении интернет соединения
 * @constructor
 */
export default function LoadActionsComponent() {
    const user = useUser()
    const travel = useTravel()
    const context = useAppContext()
    const actionSubject = useActionSubject()


    useEffect(() => {
        async function onOnline() {
            if(!user) {
                console.log('user not set receive messages after re-connect is off')
                return
            }
            const actions: Action<any>[] = await ActionService.checkForNewActions().catch(defaultHandleError) || []

            // const map = new Map<string, Action<any>[]>()
            // actions.forEach(a => {
            //     const list = map.get(a.entity) || []
            //     list.push(a)
            // })

            for (const action of actions)
            {
                const result = await ActionService.prepareNewAction(action, user)
                if (result
                    && context.travel
                    && context.travel.id
                    && action.entity === StoreName.TRAVEL
                    && context.travel.id === action.data.id
                ) {
                    const travel = await TravelService.getById(context.travel.id)
                    travel && context.setTravel(travel)
                }
                result && actionSubject.next(action)
            }


            // if(options.onTravelAction && map.has(StoreName.TRAVEL)) {
            //     const ids: string[] = map.get(StoreName.TRAVEL)!.map(a => a.data.id)
            //     options.onTravelAction(ids)
            // }
            //
            // if(options.onExpenseAction && (map.has(StoreName.EXPENSES_ACTIONS) || map.has(StoreName.EXPENSES_PLAN))) {
            //     const set = new Set<string>()
            //     if(map.has(StoreName.EXPENSES_ACTIONS)){
            //         map.get(StoreName.EXPENSES_ACTIONS)!.forEach(a => set.add(a.data.primary_entity_id))
            //     }
            //     if(map.has(StoreName.EXPENSES_PLAN)){
            //         map.get(StoreName.EXPENSES_PLAN)!.forEach(a => set.add(a.data.primary_entity_id))
            //     }
            //     const travel_ids = Array.from(set.keys())
            //     if(travel_ids.length) options.onExpenseAction(travel_ids)
            // }
            //
            // if(options.onLimitAction && map.has(StoreName.LIMIT)) options.onLimitAction()
            // if(options.onUserAction && map.has(StoreName.USERS)) options.onUserAction()
            // if(options.onMessageAction && map.has(StoreName.MESSAGE)) options.onMessageAction()

            const currentTravelAction = actions.find(a => a.entity === StoreName.TRAVEL && a.data.id === context.travel?.id)
            if(currentTravelAction) {
                const _t = await TravelService.getById(currentTravelAction?.id)
                if(_t) context.setTravel(_t)
            }
        }

        window.addEventListener('online', onOnline)
        return () => window.removeEventListener('online', onOnline)
    }, [])



    return <Outlet />
}