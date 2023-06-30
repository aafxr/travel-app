import {useState, useEffect} from "react";



export default function useExpensesList(controller,primary_entity_id){
    const [limits, setLimits] = useState([])
    const [sections, setSections] = useState([])
    const [expenses, setExpenses] = useState([])


    //получаем все лимиты на поездку
    useEffect(() => {
        if (controller) {
            controller.limitModel.getFromIndex('primary_entity_id', IDBKeyRange.only(primary_entity_id))
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
                    const sec = await controller.sectionModel.get(limit.section_id)
                    sec && res.push(sec)
                }
                setSections(res)
            }
        }

        getSections().catch(console.error)

    }, [limits])


    //получаем все расходы за поездку
    useEffect(() => {
        if (sections && sections.length) {
            controller.expensesPlanedModel.getFromIndex('primary_entity_id', IDBKeyRange.only(primary_entity_id))
                .then(setExpenses)
                .catch(console.error)
        }
    }, [sections])



    if (
        !sections.length
        || !limits.length
        || !expenses.length
    ){
        return {}
    }

    return {
        sections, limits , expenses
    }
}