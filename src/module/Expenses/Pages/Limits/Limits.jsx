import React, {useContext, useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import {Input, PageHeader} from "../../../../components/ui";
import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import getReportObj from "../../utils/getReportObj";
import AddButton from "../../components/AddButtom/AddButton";
import Container from "../../components/Container/Container";
import Section from "../../components/Section/Section";
import useExpensesList from "../../hooks/useExpensesList";

export default function Limits({
                                   user_id,
                                   primaryEntityType
                               }) {
    const {travelCode: primary_entity_id} = useParams()
    const {controller} = useContext(ExpensesContext)
    const {limits, expenses, sections} = useExpensesList(controller, primary_entity_id, 'actual')

    if (!limits || !expenses || !limits)
        return <div>Loading...</div>

    const report = sections.length && limits.length && expenses.length && getReportObj(sections, limits, expenses) || []


    return (
        <>
            <div>
                <AddButton to={`/travel/${primary_entity_id}/expenses/add/`}>Записать расходы</AddButton>
                <Container>
                    {
                        !!report.length && report.map(item => (
                            <Section key={item.id} {...item} actual/>
                        ))
                    }
                </Container>
            </div>
        </>
    )
}