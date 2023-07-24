import React, {useContext, useEffect, useState} from 'react'
import {useParams} from "react-router-dom";

import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import AddButton from "../../components/AddButtom/AddButton";
import Container from "../../components/Container/Container";
import Section from "../../components/Section/Section";


import constants from "../../db/constants";

import useFilteredExpenses from "../../hooks/useFilteredExpenses";
import {defaultFilterValue} from "../../static/vars";
import ExpensesFilterVariant from "../../components/ExpensesFilterVariant";

import '../../css/Expenses.css'
import updateExpenses from "../../helpers/updateExpenses";
import createId from "../../../../utils/createId";
import {WorkerContext} from "../../../../contexts/WorkerContextProvider";
import {onUpdate} from "../../controllers/onUpdate";


/**
 * страница отображает текущие расходы с лимитами пользователя (если указаны)
 * @param {string} user_id
 * @param {string} primary_entity_type
 * @returns {JSX.Element}
 * @constructor
 */
export default function Expenses({user_id, primary_entity_type}) {
    const {travelCode: primary_entity_id} = useParams()

    const {worker} = useContext(WorkerContext)
    const {sections, limits, expensesActualModel: model} = useContext(ExpensesContext)

    const [expenses, setExpenses] = useState([])

    const [noDataMessage, setNoDataMessage] = useState('')

    const [filter, setFilter] = useState(defaultFilterValue)

    useEffect(() => {
        const handleMessage = e => {
            console.log('expenses ', e.data)
            const {type, storeName} = e.data
            if (storeName === model.storeName && type === 'update') {
                updateExpenses(model, primary_entity_id).then(setExpenses)
            }
        }
        worker && worker.addEventListener('message', handleMessage)
        // worker && onUpdate(primary_entity_id,user_id)(model)

        return () => worker.removeEventListener('message', handleMessage)
    }, [worker])


    useEffect(() => {
        if (model) {
            setTimeout(() => setNoDataMessage('Нет расходов'), 3000)
            updateExpenses(model, primary_entity_id).then(setExpenses)
        }
    }, [model, primary_entity_id])

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
