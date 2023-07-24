import React, {useEffect, useState} from 'react'
import constants from "../db/constants";
import toArray from "../../../utils/toArray";


/**
 * поиск информации о расходах по id
 * @param {import('../../../models/Model').default} expenseModel
 * @param {string} id
 * @returns {import('../models/ExpenseType').ExpenseType | null}
 */
export default function useExpense(expenseModel, id) {
    const [expense, setExpense] = useState(null)

    useEffect(() => {
        if (expenseModel && id) {
            expenseModel.get(id)
                .then(e => setExpense(toArray(e)))
        }
    }, [expenseModel, id])

    return expense
}