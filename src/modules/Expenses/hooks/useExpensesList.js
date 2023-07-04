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
            const set = new Set()

            if (!expenses.length){
                return
            }

            expenses.forEach(item => set.add(item[constants.indexes.SECTION_ID]))

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
            .then(setExpenses)
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