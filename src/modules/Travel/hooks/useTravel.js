import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import constants from "../../../static/constants";
import storeDB from "../../../db/storeDB/storeDB";
import {actions} from "../../../redux/store";

/**
 * @typedef {Object} UseTravelType
 * @property {TravelType | null} travel
 * @property {string | null} errorMessage
 */

/**
 * поиск информации о путешествии по id
 * @returns {UseTravelType}
 */
export default function useTravel() {
    const dispatch = useDispatch()
    const {travels, travelID, travelsLoaded} = useSelector(state => state[constants.redux.TRAVEL])
    const {travelCode} = useParams()
    const [errorMessage, setErrorMessage] = useState(/**@type{string | null} */null)

    const [travel, setTravel] = useState(/**@type{TravelType | null} */ null)

    /** первая инициализация travel */
    useEffect(() => {
        if (travelCode && travelsLoaded && !travel && !travelID) dispatch(actions.travelActions.selectTravel(travelCode))
    }, [travelCode, travelsLoaded, travel])

    /** обновление travel если обновился списоек travels или  */
    useEffect(() => {
        /** в приоритете ищем travel по id travelCode */
        if (travelCode) {
            /** пробуем найти travel в списке travels глобального хранилища  */
            let tr = travels.find(t => t.id === travelCode)
            /** обновляем состояние хука и записываем текущий id путешествия в store */
            if (tr) {
                tr.id !== travelID && dispatch(actions.travelActions.selectTravel(tr.id))
                setTravel(tr)
            } else {
                /**
                 * если не удалось найти путешествие, пробуем получить информацию из локальной бд
                 * и обновляем состояние хука и стора
                 */
                storeDB.getOne(constants.store.TRAVEL, travelCode)
                    .then(t => {
                        if (t) {
                            dispatch(actions.travelActions.addTravel(t))
                            t.id !== travelID && dispatch(actions.travelActions.selectTravel(t.id))
                            setTravel(t)
                        } else {
                            setErrorMessage("Не удалось найти информацию о путешествии")
                        }
                    })
                    .catch(err => setErrorMessage("Не удалось найти информацию о путешествии"))
            }
        /** если travelCodee не задан  ищем путешествие по travelID */
        } else if (travelID) {
            const tr = travels.find(t => t.id === travelID)
            if (tr) setTravel(tr)
        }
    }, [travelCode, travelID, travels])


    return {travel, errorMessage}
}