import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import {Travel} from "../../../classes/StoreEntities";
import {StoreName} from "../../../types/StoreName";
import {DB} from "../../../db/DB";

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
    const {travelCode} = useParams()
    const [errorMessage, setErrorMessage] = useState('')

    const [travel, setTravel] = useState<Travel | null>(null)


    /** обновление travel если обновился списоек travels или  */
    useEffect(() => {
        /** в приоритете ищем travel по id travelCode */
        if (travelCode) {
            setErrorMessage('')
            DB.getOne<Travel>(StoreName.TRAVEL, travelCode,
                (travel) => {
                    if (travel) setTravel(new Travel(travel))
                },
                (e) => setErrorMessage(`Путешествие с id="${travelCode}" не найдено`))
        }
    }, [travelCode])


    return {travel, errorMessage}
}