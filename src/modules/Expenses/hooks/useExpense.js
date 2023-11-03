import React, {useEffect, useState} from 'react'
import constants from "../../../static/constants";
import storeDB from "../../../db/storeDB/storeDB";
import defaultExpense from "../helpers/defaultExpense";
import useUserSelector from "../../../hooks/useUserSelector";
import useTravelContext from "../../../hooks/useTravelContext";


/**
 * поиск информации о расходах по id
 * @param {string} id expense ID
 * @param {'plan' | 'actual'} type
 * @returns {ExpenseType | null}
 */
export default function useExpense(id, type = 'plan') {
    const {user} = useUserSelector()
    const {travel} = useTravelContext()
    const [expense, setExpense] = useState(null)

    useEffect(() => {
        const isPlan = type === 'plan'
        const storeName = isPlan ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL

        storeDB.getOne(storeName, id)
            .then(e => e && setExpense(e))
            .catch(() => setExpense(defaultExpense(travel.id, user.id)))
    }, [id, type])

    return expense
}
