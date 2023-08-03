import {useEffect, useState} from "react";
import constants from "../../../static/constants";
import ErrorReport from "../../../controllers/ErrorReport";

export default function useDefaultSection(controller, primary_entity_id, user_id) {
    const [errorMessage, setErrorMessage] = useState('')

    // добавлени дефолтных секций
    useEffect(() => {
        async function addDefaultSections() {
            if (!controller) return
            const response = await fetch(process.env.REACT_APP_SERVER_URL + '/expenses/getSections/')
            const {result: sectionList} = await response.json()

            if (sectionList.length) {

                for (const section of sectionList) {
                    const data = {
                        ...section,
                        color: '#52CF37',
                        hidden: 1,
                        primary_entity_id,
                    }

                    const sectionModel = controller.getStoreModel(constants.store.SECTION)

                    try {
                        await sectionModel.update(data)
                    } catch (err) {
                        await ErrorReport.sendError(err)
                        console.error(err)
                    }
                }
            }
        }

        addDefaultSections().catch(() => setErrorMessage("Отсутствует подключение к интернету"))
    }, [controller])

    return errorMessage
}