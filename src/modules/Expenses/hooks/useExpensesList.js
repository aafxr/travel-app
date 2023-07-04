import {useState, useEffect} from "react";
import constants from "../db/constants";


/**
 * @description считывает из бд все limits / section / expenses для текущего маршрута
 * @param {import('../../../controllers/ActionController').ActionController} controller
 * @param {string} primary_entity_id
 * @param {'plan' | 'actual'}  expensesType - default plan
 * @returns {{sections: *[], limits: *[], expenses: *[]}|{}}
 */
export default function useExpensesList(controller, primary_entity_id, expensesType = 'plan') {
    const [limits, setLimits] = useState([])
    const [sections, setSections] = useState([])
    const [expenses, setExpenses] = useState([])

    const isPlan = expensesType === 'plan'


    //получаем все лимиты на поездку
    useEffect(() => {
        if (controller) {
            controller.read({
                storeName: constants.store.LIMIT,
                index: constants.indexes.PRIMARY_ENTITY_ID,
                query: IDBKeyRange.only(primary_entity_id)
            })
                .then(lim => lim && Array.isArray(lim) ? setExpenses(lim) : setExpenses([lim]))
                .catch(console.error)
        }
    }, [controller])


    //получаем все секции для лимитов поездки
    useEffect(() => {
        async function getSections() {
            const set = new Set()

            if (!expenses || !expenses.length){
                return
            }

            expenses.forEach(item => {
                item && set.add(item[constants.indexes.SECTION_ID])
            })

            const sectionList = [...set]

            const res = []
            for (const section_id of sectionList) {
                const sec = await controller.read({
                    storeName: constants.store.SECTION,
                    action: 'get',
                    id: section_id
                })

                sec && res.push(sec)
            }
            setSections(res)
        }

        getSections().catch(console.error)

    }, [expenses])


    //получаем все расходы за поездку
    useEffect(() => {
        const storeName = isPlan ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL

        controller.read({
            storeName,
            index: constants.indexes.PRIMARY_ENTITY_ID,
            query: IDBKeyRange.only(primary_entity_id)
        })
            .then(exp => exp && Array.isArray(exp) ? setExpenses(exp) : setExpenses([exp]))
            .catch(console.error)
    }, [controller])

    if (
        !sections.length
        || !expenses.length
    ) {
        return {}
    }

    return {
        sections, limits, expenses
    }
}