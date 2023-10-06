import React, {useEffect, useState} from 'react'
import constants from "../../../static/constants";
import storeDB from "../../../db/storeDB/storeDB";


/**
 * поиск информации о расходах по id
 * @param {string} id
 * @param {'plan' | 'actual'} type
 * @returns {import('../../../types/ExpenseType').ExpenseType | null}
 */
export default function useExpense(id, type = 'plan') {
    const [expense, setExpense] = useState(null)

    useEffect(() => {
    const isPlan = type === 'plan'
        if (id) {
            const storeName = isPlan ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL
            storeDB.getOne(storeName, id)
                .then(e => e && setExpense(e))
        }
    }, [id, type])

    return expense
}
