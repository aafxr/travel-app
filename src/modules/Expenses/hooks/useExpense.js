import {useEffect, useState} from 'react'
import useTravelContext from "../../../hooks/useTravelContext";


/**
 * поиск информации о расходах по id
 * @param {string} id expense ID
 * @param {'planned' | 'actual'} type
 * @returns {Expense | undefined}
 */
export default function useExpense(id, type = 'planned') {
    const {travel} = useTravelContext()
    const [expense, setExpense] = useState(null)

    useEffect(() => {
        const sub = () => {
            let exp = travel.getExpense(type, id)
            setExpense(exp)
        }
        sub()
        travel.onUpdate(sub)
        return () => travel.offUpdate(sub)
    }, [id, type, travel])

    return expense
}
