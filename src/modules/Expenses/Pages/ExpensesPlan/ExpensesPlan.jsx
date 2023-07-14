import React, {useContext, useEffect, useState} from 'react'
import {useParams} from "react-router-dom";

import AddButton from "../../components/AddButtom/AddButton";

import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import Container from "../../components/Container/Container";
import Section from "../../components/Section/Section";

import '../../css/Expenses.css'
import useExpenses from "../../hooks/useExpenses";
import constants from "../../db/constants";
import useToBottomHeight from "../../hooks/useToBottomHeight";
import useFilteredExpenses from "../../hooks/useFilteredExpenses";
import ExpensesFilterVariant from "../../components/ExpensesFilterVariant";
import {defaultFilterValue, EXPENSES_FILTER} from "../../static/vars";


/**
 * страница отображает плановые расходы  пользователя
 * @param {string} user_id
 * @param {string} primary_entity_type
 * @returns {JSX.Element}
 * @constructor
 */
export default function ExpensesPlan({
                                         user_id,
                                         primary_entity_type
                                     }) {
    const {travelCode: primary_entity_id} = useParams()
    const {controller, sections, limits} = useContext(ExpensesContext)

    const [expenses, updateExpenses] = useExpenses(controller, primary_entity_id, "plan")

    const [noDataMessage, setNoDataMessage] = useState('')

    const [filter, setFilter] = useState(defaultFilterValue)


    useEffect(() => {
        updateExpenses()
        setTimeout(() => setNoDataMessage('Нет расходов'), 1000)
    }, [])


    useEffect(() => {
        if (controller) {
            controller.subscribe(constants.store.EXPENSES_PLAN, updateExpenses)
        }
        return () => controller.subscribe(constants.store.EXPENSES_PLAN, updateExpenses)
    }, [controller])

    const {filteredExpenses, limitsList, sectionList} = useFilteredExpenses(expenses, limits, filter, user_id)


    return (
        <>
            <Container className='expenses-pt-20 content'>
                <AddButton to={`/travel/${primary_entity_id}/expenses/plan/add/`}>Запланировать расходы</AddButton>
                {
                    sections && !!sections.length
                        ? sections
                            .filter(s => sectionList.includes(s.id))
                            .map(section => (
                                <Section
                                    key={section.id}
                                    section={section}
                                    expenses={filteredExpenses.filter(e => e.section_id === section.id)}
                                    sectionLimit={filter !== 'all' ? (limitsList.find(l => l.section_id === section.id) || null) : null}
                                    user_id={user_id}
                                />
                            ))
                        : <div>{noDataMessage}</div>
                }
            </Container>
            <ExpensesFilterVariant className='footer' value={filter} onChange={setFilter}/>

        </>
    )
}
