import React, {useContext, useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import distinctValues from "../../../../utils/distinctValues";

import AddButton from "../../components/AddButtom/AddButton";
import Line from "../../components/Line/Line";
import {Input, PageHeader, Tab} from "../../../../components/ui";

import {ExpensesContext} from "../../components/ExpensesContextProvider";
import getReportObj from "../../utils/getReportObj";
import Container from "../../components/Container/Container";
import Section from "../../components/Section/Section";


export default function ExpensesPlan({
                                         user_id,
                                         primaryEntityType
                                     }) {
    const {travelCode: primary_entity_id} = useParams()
    const {controller} = useContext(ExpensesContext)

    const [limits, setLimits] = useState([])
    const [sections, setSections] = useState([])
    const [expenses, setExpenses] = useState([])


    //получаем все лимиты на поездку
    useEffect(() => {
        if (controller) {
            controller.limitModel.getFromIndex('primary_entity_id', IDBKeyRange.only(primary_entity_id))
                .then(items => setLimits(items))
                .catch(console.error)
        }
    }, [controller])


    //получаем все секции для лимитов поездки
    useEffect(() => {
        async function getSections() {
            if (limits.length) {
                const res = []
                for (const limit of limits) {
                    const sec = await controller.sectionModel.get(limit.section_id)
                    sec && res.push(sec)
                }
                setSections(res)
            }
        }

        getSections().catch(console.error)

    }, [limits])


    //получаем все расходы за поездку
    useEffect(() => {
        if (sections && sections.length) {
            controller.expensesPlanedModel.getFromIndex('primary_entity_id', IDBKeyRange.only(primary_entity_id))
                .then(setExpenses)
                .catch(console.error)
        }
    }, [sections])


    const report = sections.length && limits.length && expenses.length && getReportObj(sections, limits, expenses) || []


    return (
        <>
            <div >
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