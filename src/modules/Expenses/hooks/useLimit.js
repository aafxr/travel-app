import {useEffect, useState} from "react";
import constants from "../db/constants";

export default function useLimit(controller, expenses, section_id, user_id) {
    const [limit, setLimit] = useState(0)
    const [minLimit, setMinLimit] = useState(0)
    const [limitOBJ, setLimitObj] = useState(null)

    useEffect(() => {
        if (controller && section_id) {
            const personalLimit = expenses
                .filter(e => e.section_id === section_id) //&& e.user_id === user_id && e.personal === 1
                .reduce((acc, exp) => exp.value + acc, 0)

            setMinLimit(personalLimit)

            controller.read({
                storeName: constants.store.LIMIT,
                index: constants.indexes.SECTION_ID,
                query: section_id
            })
                .then((item) => {
                    console.log(item)
                    if (item) {
                        if (item.value < personalLimit) {
                            controller.write({
                                storeName: constants.store.LIMIT,
                                action: 'edit',
                                user_id,
                                data: {...item, value: personalLimit}
                            })
                            setLimit(personalLimit)
                        } else {
                            setLimit(item.value)
                        }
                        setLimitObj(item)
                    } else {
                        setLimitObj(null)
                        setLimit(personalLimit)
                    }
                })
                .catch(console.error)
        }
    }, [controller, section_id])


    return [minLimit, limit, limitOBJ]
}