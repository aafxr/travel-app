import {useCallback, useEffect, useState} from "react";
import constants from "../db/constants";


/**
 * хук возвращает массив расходов для выбранного маршрута (primary_entity_id)
 * @param {import('../../../controllers/ActionController').ActionController} controller
 * @param {string} primary_entity_id
 * @param {'plan' | 'actual'} type default = plan
 * @returns {Array.<import('../models/ExpenseType').ExpenseType>}
 */
export default function useExpenses(controller, primary_entity_id, type = 'plan'){
    const [expenses, setExpenses] = useState([])
    const isPlan =  type === 'plan'

    const update = useCallback(() => {
        if (controller){
            console.log('useExpenses')
            const storeName = isPlan ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL
            controller.read({
                storeName,
                index: constants.indexes.PRIMARY_ENTITY_ID,
                query: 'all'
            })
                .then(item => item && Array.isArray(item) ? setExpenses(item) : setExpenses([item]))
        }
    }, [controller, primary_entity_id])


    return [expenses, update]
}