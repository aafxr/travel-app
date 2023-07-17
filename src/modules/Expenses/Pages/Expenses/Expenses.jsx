import React, {useContext, useEffect, useState} from 'react'
import {useParams} from "react-router-dom";

import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import AddButton from "../../components/AddButtom/AddButton";
import Container from "../../components/Container/Container";
import Section from "../../components/Section/Section";


import useExpenses from "../../hooks/useExpenses";
import constants from "../../db/constants";

import useFilteredExpenses from "../../hooks/useFilteredExpenses";
import {defaultFilterValue} from "../../static/vars";
import ExpensesFilterVariant from "../../components/ExpensesFilterVariant";

import '../../css/Expenses.css'


/**
 * страница отображает текущие расходы с лимитами пользователя (если указаны)
 * @param {string} user_id
 * @param {string} primary_entity_type
 * @returns {JSX.Element}
 * @constructor
 */
export default function Expenses({user_id, primary_entity_type}) {
    const {travelCode: primary_entity_id} = useParams()
    const {controller, sections, limits} = useContext(ExpensesContext)

    const [expenses, updateExpenses] = useExpenses(controller, primary_entity_id, "actual")

    const [noDataMessage, setNoDataMessage] = useState('')

    const [filter, setFilter] = useState(defaultFilterValue)


    useEffect(() => {
        if (controller) {
            updateExpenses()
            setTimeout(() => setNoDataMessage('Нет расходов'), 1000)
            controller.subscribe(constants.store.EXPENSES_ACTUAL, updateExpenses)
        }
        return () => controller.unsubscribe(constants.store.EXPENSES_ACTUAL, updateExpenses)
    }, [])

    const {filteredExpenses, limitsList, sectionList} = useFilteredExpenses(expenses, limits,  filter, user_id)


    return (
        <>
            <Container className='expenses-pt-20 content column gap-1'>
                <AddButton to={`/travel/${primary_entity_id}/expenses/add/`}>Записать расходы</AddButton>
                {
                    sectionList && !!sectionList.length
                        ? sections
                            .filter(s => sectionList.includes(s.id))
                            .map(section => (
                                <Section
                                    key={section.id}
                                    section={section}
                                    expenses={filteredExpenses.filter(e => e.section_id === section.id)}
                                    sectionLimit={filter !== 'all' ? (limitsList.find(l => l.section_id === section.id) || null): null}
                                    user_id={user_id}
                                    line
                                />
                            ))
                        : <div>{noDataMessage}</div>
                }
            </Container>
            <ExpensesFilterVariant className='footer' value={filter} onChange={setFilter} />
        </>
    )
}