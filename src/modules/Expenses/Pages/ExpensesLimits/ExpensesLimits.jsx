import React, {useContext, useEffect, useState} from 'react'
import {useParams} from "react-router-dom";

import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import AddButton from "../../components/AddButtom/AddButton";
import Container from "../../components/Container/Container";
import Section from "../../components/Section/Section";

import useExpensesList from "../../hooks/useExpensesList";

import getReportObj from "../../utils/getReportObj";

import '../../css/Expenses.css'
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";

export default function ExpensesLimits({
                                          user_id,
                                          primaryEntityType
                                      }) {
    const {travelCode: primary_entity_id} = useParams()
    const {controller} = useContext(ExpensesContext)
    const {limits, expenses, sections} = useExpensesList(controller, primary_entity_id, 'actual')

    const [noDataMessage, setNoDataMessage] = useState('')

    useEffect(() => {
        setTimeout(() => setNoDataMessage('Нет расходов'), 1000)
    }, [])

    const report = sections && limits && expenses && getReportObj(sections, limits, expenses) || []



    return (
        <div>
            <Container className='expenses-pt-20'>
                <AddButton to={`/travel/${primary_entity_id}/expenses/add/`}>Записать расходы</AddButton>
                {
                    report && !!report.length
                        ? report.map(item => (
                            <Section key={item.id} {...item} user_id={user_id} actual />
                        ))
                        : <div>{noDataMessage}</div>
                }
            </Container>
        </div>
    )
}