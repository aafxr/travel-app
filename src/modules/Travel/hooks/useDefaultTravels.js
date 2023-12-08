import {useEffect} from "react";
import {useDispatch} from "react-redux";

import constants from "../../../static/constants";
import storeDB from "../../../db/storeDB/storeDB";
import {actions} from "../../../redux/store";
import aFetch from "../../../axios";


/**
 *
 * @param travelController
 * @param user_id.
 * @deprecated
 */
export default function useDefaultTravels(travelController, user_id) {
const dispatch = useDispatch()

    useEffect(() => {
        if (travelController && user_id && dispatch()) {
            fetchTravels(travelController, user_id).catch(console.error)
                .then(travels => dispatch(actions.travelActions.setTravels(travels)))
        }
    }, [travelController, user_id, dispatch])
}


async function fetchTravels(controller, user_id) {
    const response = await aFetch.get('/travel/getList/')
    const {ok, data: travels} = response.data

    if (ok && travels && travels.length) {
        await Promise.all(
            travels.map(travel => storeDB.editElement(constants.store.TRAVEL, travel))
        )
        return travels
    }
    return []
}
