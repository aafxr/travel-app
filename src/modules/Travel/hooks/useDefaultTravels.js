import {useEffect} from "react";
import constants from "../../../static/constants";
import aFetch from "../../../axios";

export default function useDefaultTravels(travelController,user_id){


    useEffect(() => {
        if(travelController){
            fetchTravels(travelController, user_id).catch(console.error)
        }
    }, [travelController, user_id])
}


async function fetchTravels(controller, user_id){
    const response = await aFetch.get('/travel/getList/')
    const {ok, result: travels} = response.data

    if(ok && travels && travels.length){
        for(const travel of travels){
            await controller.write({
                user_id,
                data: travel,
                action:'add',
                storeName: constants.store.TRAVEL
            })
        }
        return travels
    }
    return []
}
