import {useCallback, useEffect, useState} from "react";
import constants from "../db/constants";

/**
 * возвращает массив секций
 * @param {import('../../../controllers/ActionController').ActionController} controller
 * @param {Array.<string>} [sectionIdList] массив id секций
 * @returns {Array.<import('../models/SectionType').SectionType>}
 */
export default function useSections(controller, sectionIdList) {
    const [sections, setSections] = useState([])

    const update = useCallback(() => {
        async function sectionsFromArray(arr){
            const result = []
            for (const id of arr) {
                await controller.read({
                    storeName: constants.store.SECTION,
                    action: 'get',
                    id
                })
                    .then(item => item && result.push(item))
            }
            return result
        }


        if (controller) {
            if (sectionIdList) {
                sectionsFromArray(sectionIdList)
                    .then(setSections)
            } else {
                controller.read({
                    storeName: constants.store.SECTION,
                    action: 'get',
                    query: 'all'
                })
                    .then(item => item && Array.isArray(item) ? setSections(item) : setSections([item]))
            }

        }
    }, [controller, sectionIdList])


    return [sections,update]
}