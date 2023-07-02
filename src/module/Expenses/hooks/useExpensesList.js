import {useState, useEffect} from "react";
import constants from "../db/constants";


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
                .then(items => setLimits(items))
                .catch(console.error)
        }
    }, [controller])


    //получаем все секции для лимитов поездки
    useEffect(() => {
        async function getSections() {
            if (limits.length) {
                const res = []
                for (const limit of limits) {
                    const sec = await controller.read({
                        storeName: constants.store.SECTION,
                        action: 'get',
                        id: limit.section_id
                    })

                    sec && res.push(sec)
                }
                setSections(res)
            }
        }

        getSections().catch(console.error)

    }, [limits])


    //получаем все расходы за поездку
    useEffect(() => {
        const storeName = isPlan ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL

        if (sections && sections.length) {
            controller.read({
                storeName,
                index: constants.indexes.PRIMARY_ENTITY_ID,
                query: IDBKeyRange.only(primary_entity_id)
            })
                .then(setExpenses)
                .catch(console.error)
        }
    }, [sections])


    if (
        !sections.length
        || !limits.length
        || !expenses.length
    ) {
        return {}
    }

    return {
        sections, limits, expenses
    }
}