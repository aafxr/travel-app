import React, {useEffect, useState} from 'react'
import constants from "../db/constants";


/**
 * поиск информации о расходах по id
 * @param {import('../../../controllers/ActionController').ActionController} controller
 * @param {string} id
 * @param {'plan' | 'actual'} type
 * @returns {import('../models/ExpenseType').ExpenseType | null}
 */
export default function useExpense(controller, id, type = 'plan') {
    const [expense, setExpense] = useState(null)
    const isPlan = type === 'plan'

    useEffect(() => {
        if (controller && id) {
            const storeName = isPlan ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL
            controller.read({
                storeName,
                id
            })
                .then(e => e && setExpense(e))
        }
    }, [controller, id])

    return expense
}