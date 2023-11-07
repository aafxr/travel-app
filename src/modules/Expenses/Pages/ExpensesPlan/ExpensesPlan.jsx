import React, { useEffect, useState} from 'react'

import combineExpensesForSectionComponent from "../../helpers/combineExpensesForSectionComponent";
import ExpensesFilterVariant from "../../components/ExpensesFilterVariant";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import Container from "../../../../components/Container/Container";
import useTravelContext from "../../../../hooks/useTravelContext";
import useUserSelector from "../../../../hooks/useUserSelector";
import Section from "../../components/Section/Section";
import {defaultFilterValue} from "../../static/vars";
import constants from "../../../../static/constants";

import '../../css/Expenses.css'


/**
 * страница отображает плановые расходы  пользователя
 * @function
 * @name ExpensesPlan
 * @returns {JSX.Element}
 * @category Pages
 */
export default function ExpensesPlan() {
    const {user} = useUserSelector()
    const {travel} = useTravelContext()
    const [filter, setFilter] = useState(/**@type{ExpenseFilterType} */defaultFilterValue)
    const [sectionComponentData, setSectionComponentData] = useState(/**@type{SectionComponentDataType[]} */[])

    const [noDataMessage, setNoDataMessage] = useState('')


    /** загрузка расходов из бд */
    useEffect(() => {
        setTimeout(() => setNoDataMessage('Нет расходов'), 2000)
    }, [travel])

    useEffect(() => {
        combineExpensesForSectionComponent(constants.store.EXPENSES_PLAN, filter, travel.id, user.id)
            .then(setSectionComponentData)

        function sub(){
            combineExpensesForSectionComponent(constants.store.EXPENSES_PLAN, filter, travel.id, user.id)
                .then(setSectionComponentData)
        }
        travel.onUpdate(sub)

        return () => {
            travel.offUpdate(sub)
        }
    }, [travel, filter])

    useEffect(() => {

    }, [])


    return (
        <>
            <Container className='pt-20 content column gap-1'>
                <AddButton to={`/travel/${travel.id}/expenses/plan/add/`}>Запланировать расходы</AddButton>
                {
                    sectionComponentData.length > 0
                        ? sectionComponentData.map(sk => (
                            <Section
                                key={sk.section_id}
                                {...sk}
                                user_id={user.id}
                                line
                                planed
                            />
                        ))
                        : <div>{noDataMessage}</div>
                }
            </Container>
            <ExpensesFilterVariant className='footer' value={filter} onChange={setFilter}/>

        </>
    )
}
