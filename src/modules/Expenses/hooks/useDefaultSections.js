import {useEffect, useState} from "react";
import constants from "../../../static/constants";
import ErrorReport from "../../../controllers/ErrorReport";
import aFetch from "../../../axios";
import storeDB from "../../../classes/db/storeDB/storeDB";
import {actions} from "../../../redux/store";


/**
 *
 * @param {string} primary_entity_id
 * @param {string} user_id
 * @return {string}
 */
export default function useDefaultSection(primary_entity_id, user_id) {
    const [errorMessage, setErrorMessage] = useState('')

    // добавлени дефолтных секций
    useEffect(() => {
        async function addDefaultSections() {
            const response = await aFetch.get('/expenses/getSections/')
            let {ok,data} = response.data

            if (ok) {
                const sectionList = data.map(s => ({
                    ...s,
                    color: '#52CF37',
                    hidden: 1,
                    primary_entity_id,
                }))


                try {
                Promise.all(sectionList.map(s => storeDB.editElement(constants.store.SECTION, s)))
                    .then(dispatch(actions.expensesActions.setSections(sectionList)))
                } catch (err) {
                    await ErrorReport.sendError(err)
                    console.error(err)
                }
            }
        }

        addDefaultSections().catch(() => setErrorMessage("Отсутствует подключение к интернету"))
    }, [dispatch, primary_entity_id])

    return errorMessage
}