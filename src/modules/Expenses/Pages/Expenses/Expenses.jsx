import React, { useContext, useEffect, useState} from 'react'
import {useParams} from "react-router-dom";

import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import AddButton from "../../components/AddButtom/AddButton";
import Container from "../../components/Container/Container";
import Section from "../../components/Section/Section";


import constants from "../../../../static/constants";

import useFilteredExpenses from "../../hooks/useFilteredExpenses";
import {defaultFilterValue} from "../../static/vars";
import ExpensesFilterVariant from "../../components/ExpensesFilterVariant";

import '../../css/Expenses.css'
import updateExpenses from "../../helpers/updateExpenses";


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

    const [expenses, setExpenses] = useState([])

    const [noDataMessage, setNoDataMessage] = useState('')

    const [filter, setFilter] = useState(defaultFilterValue)


    useEffect(() => {
        if (controller) {
            setTimeout(() => setNoDataMessage('Нет расходов'), 1000)
            updateExpenses(controller, primary_entity_id, "actual").then(setExpenses)
            controller.subscribe(constants.store.EXPENSES_ACTUAL, async ()=> setExpenses(await updateExpenses(controller, primary_entity_id, "actual")))
        }
        // return () => controller.unsubscribe(constants.store.EXPENSES_ACTUAL, updateExpenses)
    }, [controller])

    const {filteredExpenses, limitsList, sectionList} = useFilteredExpenses(expenses, limits, filter, user_id)

    const sectionLimit = function (section) {
        if (filter !== 'all') {
            return limitsList.find(l => l.section_id === section.id) || null
        } else {
            const value = limitsList
                .filter(l => (
                    l.section_id === section.id
                    && (l.personal === 0 || l.user_id === user_id)
                ))
                .map(l => l.value)
                .reduce((acc, l) => acc + l, 0)

            return {
                id: Date.now(),
                value
            }
        }
    }

    return (
        <>
            <Container className='pt-20 content column gap-1'>
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
                                    sectionLimit={sectionLimit}
                                    user_id={user_id}
                                    line
                                />
                            ))
                        : <div>{noDataMessage}</div>
                }
            </Container>
            <ExpensesFilterVariant className='footer' value={filter} onChange={setFilter}/>
        </>
    )
}