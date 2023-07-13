import {useEffect} from "react";
import constants from "../db/constants";

export default function useDefaultSection(controller, primary_entity_id, user_id){
    // добавлени дефолтных секций
    useEffect(() => {
        async function addDefaultSections() {
            if (!controller) return

            console.log('=========================addDefaultSections=========================')

            const response = await fetch(process.env.REACT_APP_SERVER_URL + '/expenses/getSections/')
            // console.log('server actions ',  await fetch(process.env.REACT_APP_SERVER_URL + '/expenses/getActions/'))
            const {result: sectionList} = await response.json()

            if (sectionList.length) {

                for (const section of sectionList) {
                    const data = {
                        ...section,
                        color: '#52CF37',
                        hidden: 1,
                        primary_entity_id,
                    }

                    await controller.write({
                        storeName: constants.store.SECTION,
                        action: 'edit',
                        user_id,
                        data
                    })
                }
            }
        }

        addDefaultSections()
    }, [controller])
}