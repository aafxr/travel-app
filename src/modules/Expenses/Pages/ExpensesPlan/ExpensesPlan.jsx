import React, {useEffect, useState} from 'react'

import combineExpensesForSectionComponent from "../../helpers/combineExpensesForSectionComponent";
import ExpensesFilterVariant from "../../components/ExpensesFilterVariant";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import Container from "../../../../components/Container/Container";
import useTravelContext from "../../../../hooks/useTravelContext";
import useUserSelector from "../../../../hooks/useUserSelector";
import Section from "../../components/Section/Section";

import '../../css/Expenses.css'


/**
 * страница отображает плановые расходы  пользователя
 * @function
 * @name ExpensesPlan
 * @returns {JSX.Element}
 * @category Pages
 */
export default function ExpensesPlan() {
    const user = useUserSelector()
    const {travel} = useTravelContext()
    const [sectionComponentData, setSectionComponentData] = useState(/**@type{SectionComponentDataType[]} */[])

    const [noDataMessage, setNoDataMessage] = useState('')


    /** загрузка расходов из бд */
    useEffect(() => {
        setTimeout(() => setNoDataMessage('Нет расходов'), 2000)
    }, [travel])

    useEffect(() => {
        combineExpensesForSectionComponent(travel, "planned", travel.expenseFilter)
            .then(setSectionComponentData)

        function sub() {
            combineExpensesForSectionComponent(travel, "planned", travel.expenseFilter)
                .then(setSectionComponentData)
        }

        travel.onUpdate(sub)

        return () => {
            travel.offUpdate(sub)
        }
    }, [travel])

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
            {
                travel.adults_count > 1 && (
                    <ExpensesFilterVariant
                        className='footer'
                        value={travel.expenseFilter}
                        onChange={travel.setExpenseFilter.bind(travel)}
                    />
                )
            }

        </>
    )
}
