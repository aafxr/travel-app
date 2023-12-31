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
 * страница отображает текущие расходы с лимитами пользователя (если указаны)
 * @function
 * @name Expenses
 * @returns {JSX.Element}
 * @category Pages
 */
export default function Expenses() {
    const user = useUserSelector()
    const {travel, travelObj} = useTravelContext()
    const [sectionComponentData, setSectionComponentData] = useState(/**@type{SectionComponentDataType[]} */[])

    const [noDataMessage, setNoDataMessage] = useState('')


    /** загрузка расходов из бд */
    useEffect(() => {
        setTimeout(() => setNoDataMessage('Нет расходов'), 2000)
    }, [travel])

    useEffect(() => {
        combineExpensesForSectionComponent(travel,"actual",
            travelObj.adults_count === 1
                ? 'All'
                : travel.expenseFilter)
            .then(setSectionComponentData)
    }, [travel])

    useEffect(() => {
        function sub(){
            combineExpensesForSectionComponent(travel,"actual",
                travelObj.adults_count === 1
                    ? 'All'
                    : travel.expenseFilter)
                .then(setSectionComponentData)
        }
        travel.onUpdate(sub)

        return () => {
            travel.offUpdate(sub)
        }
    }, [])


    return (
        <>
            <Container className='pt-20 content column gap-1'>
                <AddButton to={`/travel/${travelObj.id}/expenses/add/`}>Записать расходы</AddButton>
                {
                    sectionComponentData.length > 0
                        ? sectionComponentData.map(sk => (
                            <Section
                                key={sk}
                                {...sk}
                                user_id={user.id}
                                line
                            />
                        ))
                        : <div>{noDataMessage}</div>
                }
            </Container>
            {
                travelObj.adults_count > 1 && (
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
