import {useCallback, useEffect, useState} from "react";
import constants from "../db/constants";

/**
 * возвращает список секций или пустой массив
 * @param {import('../../../controllers/ActionController').ActionController} controller
 * @param {string} primary_entity_id
 * @param {Array.<string>} [sectionIdList] массив id секций
 * @returns {Array.<import('../models/LimitType').LimitType>}
 */
export default function useLimits(controller, primary_entity_id, sectionIdList) {
    const [limits, setLimits] = useState([])

    const update = useCallback(() => {
        async function limitsFromArray(arr) {
                let items = await controller.read({
                    storeName: constants.store.LIMIT,
                    index: constants.indexes.PRIMARY_ENTITY_ID,
                    query: 'all'
                })

            items = Array.isArray(items) ? items : [items]

            return items.filter(l => arr.includes(l.section_id))
        }


        if (controller) {
            if (sectionIdList) {
                limitsFromArray(sectionIdList)
                    .then(setLimits)
            } else {
                controller.read({
                    storeName: constants.store.LIMIT,
                    index: constants.indexes.PRIMARY_ENTITY_ID,
                    query: 'all'
                })
                    .then(items => items && setLimits(Array.isArray(items) ? items : [items]))
            }
        }
    }, [controller,primary_entity_id, sectionIdList])


    return [limits, update]
}