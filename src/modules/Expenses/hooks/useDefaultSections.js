import {useEffect, useState} from "react";
import constants from "../db/constants";
import ErrorReport from "../../../controllers/ErrorReport";

export default function useDefaultSection(model, primary_entity_id, user_id) {
    const [errorMessage, setErrorMessage] = useState('')

    // добавлени дефолтных секций
    useEffect(() => {
        async function addDefaultSections() {
            if (!model) return
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

                    try {
                        await model.edit(data)
                    } catch (err) {
                        await ErrorReport.sendError(err)
                        console.error(err)
                    }
                }
            }
        }

        addDefaultSections().catch(() => setErrorMessage("Отсутствует подключение к интернету"))
    }, [model])

    return errorMessage
}