import React, {useContext, useEffect, useState} from 'react'
import {useParams} from "react-router-dom";

import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import AddButton from "../../components/AddButtom/AddButton";
import Container from "../../components/Container/Container";
import Section from "../../components/Section/Section";


import '../../css/Expenses.css'
import useExpenses from "../../hooks/useExpenses";
import useSections from "../../hooks/useSections";
import distinctValues from "../../../../utils/distinctValues";
import useLimits from "../../hooks/useLimits";


/**
 * страница отображает текущие расходы с лимитами пользователя (если указаны)
 * @param {string} user_id
 * @param {string} primaryEntityType
 * @returns {JSX.Element}
 * @constructor
 */
export default function Expenses({
                                     user_id,
                                     primaryEntityType
                                 }) {
    const {travelCode: primary_entity_id} = useParams()
    const {controller} = useContext(ExpensesContext)

    const [expenses, updateExpenses] = useExpenses(controller, primary_entity_id, "actual")
    const sectionList = distinctValues(expenses, exp => exp.section_id)
    const [sections, updateSections] = useSections(controller, sectionList)
    const [limits, updateLimits] = useLimits(controller, primary_entity_id, sectionList)

    const [noDataMessage, setNoDataMessage] = useState('')

    useEffect(() => {
        controller && (window.controller = controller)
        updateExpenses()
        setTimeout(() => setNoDataMessage('Нет расходов'), 1000)
    }, [])

    useEffect(() => {
        if (expenses && expenses.length) {
            updateSections()
            updateLimits()
        }
    }, [expenses])


    return (
        <div>
            <Container className='expenses-pt-20'>
                <AddButton to={`/travel/${primary_entity_id}/expenses/add/`}>Записать расходы</AddButton>
                {
                    sections && !!sections.length
                        ? sections.map(section => (
                            <Section
                                key={section.id}
                                section={section}
                                expenses={expenses.filter(e => e.section_id === section.id)}
                                sectionLimit={(limits.find(l => l.section_id === section.id) || null)}
                                user_id={user_id}
                                line
                            />
                        ))
                        : <div>{noDataMessage}</div>
                }
            </Container>
        </div>
    )
}