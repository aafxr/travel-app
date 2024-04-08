import {useEffect} from "react";

import defaultHandleError from "../utils/error-handlers/defaultHandleError";
import {ActionService} from "../classes/services/ActionService";
import {useAppContext} from "../contexts/AppContextProvider";
import {Travel} from "../classes/StoreEntities";
import {StoreName} from "../types/StoreName";
import {DB} from "../classes/db/DB";

export function useConnectionResetFetchActions(){
    const context = useAppContext()

    useEffect(() => {
        async function onOnline(){
            const travel = context.travel
            if(!travel) return

            await ActionService.checkNewActionsWhileReconnect(context, travel.id)
                .then(async (res) => {
                    console.log(res)
                    if(res[StoreName.TRAVEL]){
                        const t = await DB.getOne<Travel>(StoreName.TRAVEL, travel.id)
                        if(t) context.setTravel(t)
                    }
                })
                .catch(defaultHandleError)
        }

        window.addEventListener('online', onOnline)
        return () => window.removeEventListener('online', onOnline)
    }, [])

}