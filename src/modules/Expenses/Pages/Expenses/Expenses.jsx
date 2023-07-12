import React, {useContext, useEffect, useMemo, useState} from 'react'
import {useParams} from "react-router-dom";

import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import AddButton from "../../components/AddButtom/AddButton";
import Container from "../../components/Container/Container";
import Section from "../../components/Section/Section";


import '../../css/Expenses.css'
import useExpenses from "../../hooks/useExpenses";
import distinctValues from "../../../../utils/distinctValues";
import constants from "../../db/constants";
import Button from "../../components/Button/Button";
import useToBottomHeight from "../../hooks/useToBottomHeight";

import {filterType, local} from "../../static/vars";


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

    const [filter, setFilter] = useState('all')

    const ref = useToBottomHeight()


    useEffect(() => {
        updateExpenses()
        setTimeout(() => setNoDataMessage('Нет расходов'), 1000)
    }, [])


    useEffect(() => {
        if (controller) {
            controller.subscribe(constants.store.EXPENSES_ACTUAL, updateExpenses)
        }
        return () => controller.unsubscribe(constants.store.EXPENSES_ACTUAL, updateExpenses)
    }, [])

    const filteredExpenses = useMemo(() => {
        if (filter === 'personal') {
            return expenses.filter(e => e.user_id === user_id && e.personal === 1)
        } else if (filter === 'common') {
            return expenses.filter(e => e.personal === 0)
        } else {
            return expenses
        }
    }, [expenses, filter])


    const sectionList = distinctValues(filteredExpenses, exp => exp.section_id)

    const limitsList = useMemo(function () {
        if (filter === 'personal') {
            return limits
                .filter(l => l.user_id === user_id && l.personal === 1)
                .filter(l => sectionList.includes(l.section_id))
        } else {
            return limits
                .filter(l => l.personal === 0)
                .filter(l => sectionList.includes(l.section_id))
        }
    }, [limits, filter])

    return (
        <div ref={ref} className='wrapper'>
            <Container className='expenses-pt-20 content'>
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

            <Container className='footer footer-btn-container flex-between gap-1'>
                {
                    filterType.map(f => (
                        <Button key={f} className='center' active={f === filter} onClick={() => setFilter(f)}>{local[f]}</Button>
                    ))
                }
            </Container>
        </div>
    )
}