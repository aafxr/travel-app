import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import constants from "../../../static/constants";
import storeDB from "../../../db/storeDB/storeDB";
import {actions} from "../../../redux/store";

/**
 * поиск информации о путешествии по id
 * @returns {TravelType | null}
 */
export default function useTravel() {
    const dispatch = useDispatch()
    const {travels, travelID, travelsLoaded} = useSelector(state => state[constants.redux.TRAVEL])
    const {travelCode} = useParams()

    const [travel, setTravel] = useState(null)

    useEffect(() => {
        if (travelCode && travelsLoaded && !travel && !travelID) dispatch(actions.travelActions.selectTravel(travelCode))
    }, [travelCode, travelsLoaded, travel])


    useEffect(() => {
        if (travelCode && travelID && Array.isArray(travels)) {
            let tr = travels.find(t => t.id === travelID)

            if (tr) {
                tr.id!== travelID && dispatch(actions.travelActions.selectTravel(tr.id))
                setTravel(tr)
            }
            else {
                storeDB.getOne(constants.store.TRAVEL, travelCode)
                    .then(t => {
                        if (t) {
                            dispatch(actions.travelActions.addTravel(t))
                            t.id !== travelID && dispatch(actions.travelActions.selectTravel(t.id))
                            setTravel(t)
                        }
                    })
            }
        }
    }, [travelCode,travelID, travels])

    return travel
}