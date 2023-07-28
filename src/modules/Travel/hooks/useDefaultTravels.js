import {useEffect} from "react";
import constants from "../../../static/constants";

export default function useDefaultTravels(travelController,user_id){


    useEffect(() => {
        if(travelController){
            fetchTravels(travelController, user_id).catch(console.error)
        }
    }, [travelController, user_id])
}


async function fetchTravels(controller, user_id){
    const response = await fetch(process.env.REACT_APP_SERVER_URL + '/travel/getList/')
    const {ok, result: travels} = await response.json()

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
