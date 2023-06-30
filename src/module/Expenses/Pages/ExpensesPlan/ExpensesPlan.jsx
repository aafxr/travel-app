import React, {useContext, useEffect, useState} from 'react'
import {useParams} from "react-router-dom";

import AddButton from "../../components/AddButtom/AddButton";

import {ExpensesContext} from "../../components/ExpensesContextProvider";
import getReportObj from "../../utils/getReportObj";
import Container from "../../components/Container/Container";
import Section from "../../components/Section/Section";
import useExpensesList from "../../hooks/useExpensesList";


export default function ExpensesPlan({
                                         user_id,
                                         primaryEntityType
                                     }) {
    const {travelCode: primary_entity_id} = useParams()
    const {controller} = useContext(ExpensesContext)
    const {limits, expenses, sections} = useExpensesList(controller, primary_entity_id)

    if (!limits || !expenses || !limits)
        return <div>Loading...</div>

    const report = sections.length && limits.length && expenses.length && getReportObj(sections, limits, expenses) || []
    console.log(report)


    return (
        <>
            <div>
                <AddButton to={`/travel/${primary_entity_id}/expenses/plan/add/`}>Записать расходы</AddButton>
                <Container>
                    {
                        !!report.length && report.map(item => (
                            <Section key={item.id} {...item} />
                        ))
                    }
                </Container>
            </div>
        </>
    )
}