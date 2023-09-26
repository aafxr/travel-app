import {useEffect, useState} from "react";
import constants from "../../../static/constants";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import storeDB from "../../../db/storeDB/storeDB";

/**
 * поиск информации о путешествии по id
 * @param {string} travel_id
 * @returns {import('../models/ExpenseType').ExpenseType | null}
 */
export default function useTravel(travel_id) {
    const {travelCode} = useParams()
    const {travels} = useSelector(state => state[constants.redux.TRAVEL])
    const [travel, setTravel] = useState(null)

    useEffect(() => {
        if (travel_id) {
            if (travels && Array.isArray(travels)) {
                const tr = travels.find(t => t.id === travelCode)
                if(tr) setTravel(tr)
                else{
                    storeDB.getOne(constants.store.TRAVEL, travelCode)
                        .then(tr => tr && setTravel(tr))
                }
            }
        }
    }, [travel_id])

    return travel
}