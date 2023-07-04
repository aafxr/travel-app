import {useEffect, useState} from "react";
import constants from "../db/constants";

/**
 * возвращает список секций
 * @param {import('../../../controllers/ActionController').ActionController} controller
 * @returns {Array}
 */
export default function useSections(controller) {
    const [sections, setSections] = useState([])

    useEffect(() => {
        if (controller){
            controller.read({
                storeName: constants.store.SECTION,
                action: 'get',
                query: 'all'
            })
                .then(item => item && Array.isArray(item) ? setSections(item) : setSections([item]))
        }
    }, [])

    return sections
}