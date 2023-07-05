import {useCallback, useEffect, useState} from "react";
import constants from "../db/constants";

/**
 * возвращает список секций
 * @param {import('../../../controllers/ActionController').ActionController} controller
 * @param {string} primary_entity_id
 * @param {Array.<string>} sectionIdList массив id секций
 * @returns {Array.<import('../models/LimitType').LimitType>}
 */
export default function useLimits(controller, primary_entity_id, sectionIdList) {
    const [limits, setLimits] = useState([])

    const update = useCallback(() => {
        async function limitsFromArray(arr) {
            const result = []
            for (const id of arr) {
                await controller.read({
                    storeName: constants.store.LIMIT,
                    index: constants.indexes.SECTION_ID,
                    query: id
                })
                    .then(item => item && result.push(item))
            }
            return result
        }


        if (controller) {
            if (sectionIdList) {
                limitsFromArray(sectionIdList)
                    .then(setLimits)
            } else {
                controller.read({
                    storeName: constants.store.LIMIT,
                    index: constants.indexes.PRIMARY_ENTITY_ID,
                    query: IDBKeyRange.only(primary_entity_id)
                })
                    .then(items => items && setLimits(Array.isArray(items) ? items : [items]))
            }
        }
    }, [controller, sectionIdList])


    return [limits, update]
}