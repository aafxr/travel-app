import {useEffect} from "react";
import constants from "../../../static/constants";
import aFetch from "../../../axios";
import travelDB from "../../../db/travelDB/travelDB";
import {useDispatch} from "react-redux";
import {actions} from "../../../redux/store";

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
            travels.map(travel => travelDB.editElement(constants.store.TRAVEL, travel))
        )
        return travels
    }
    return []
}
