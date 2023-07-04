import {useEffect, useState} from "react";
import constants from "../db/constants";

/**
 * возвращает список секций
 * @param {import('../../../controllers/ActionController').ActionController} controller
 * @param {string} primary_entity_id
 * @param {string} user_id
 * @returns {Array}
 */
export default function useLimits(controller, primary_entity_id, user_id) {
    const [limits, setLimits] = useState([])

    useEffect(() => {
        if (controller) {
            controller.read({
                storeName: constants.store.LIMIT,
                index: constants.indexes.PRIMARY_ENTITY_ID,
                query: IDBKeyRange.only(primary_entity_id)
            })
                .then(item => {
                    if (item) {
                        let limitList = Array.isArray(item) ? item : [item]
                        limitList = limitList.filter(l => l && l.user_id === user_id)
                        setLimits(limitList)
                    }
                })
        }
    }, [])

    return limits
}