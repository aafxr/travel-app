import {useEffect, useState} from "react";
import constants from "../db/constants";

/**
 * поиск информации о путешествии по id
 * @param {import('../../../controllers/ActionController').ActionController} controller
 * @param {string} id
 * @returns {import('../models/ExpenseType').ExpenseType | null}
 */
export default function useTravel(controller, id) {
    const [travel, setTravel] = useState(null)

    useEffect(() => {
        if (controller && id) {
            const storeName = constants.store.TRAVEL
            controller.read({
                storeName,
                id
            })
                .then(e => e && setTravel(Array.isArray(e) ? e[0] : e))
        }
    }, [controller, id])

    return travel
}