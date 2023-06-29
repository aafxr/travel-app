import React, {useContext, useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import distinctValues from "../../../../utils/distinctValues";

import ExpensesActionController from '../../controllers/ExpensesActionController'
import {LocalDB} from "../../../../db";
import schema from '../../db/schema'

import AddButton from "../../components/AddButtom/AddButton";
import Line from "../../components/Line/Line";
import {Input, PageHeader, Tab} from "../../../../components/ui";

import {ExpensesContext} from "../../components/ExpensesContextProvider";


export default function ExpensesPlan({
                                         user_id,
                                         primaryEntityType
                                     }) {
    const {travelCode: primary_entity_id} = useParams()
    const {controller} = useContext(ExpensesContext)

    const [sections, setSections] = useState([])
    const [expenses, setExpenses] = useState([])

        useEffect(() => {
        if (controller) {
            controller.sectionModel.get('all')
                .then(items => distinctValues(items, item => item.id))
                .then(items => setSections(items))
                .catch(console.error)
        }
    }, [])

    useEffect(() => {
        if (sections.length) {
            controller.expensesActualModel.getFromIndex('section_id', IDBKeyRange.only(sections[0]))
                .then(setExpenses)
                .catch(console.error)
        }
    }, [sections])

    console.log(expenses)

    return (
        <>
            <div style={{padding: '0 20px'}}>
                <AddButton>Записать расходы</AddButton>
                <Line value={0.3} color={'#52CF37'}/>
                <br/>
                <Line value={0.8} color={'red'}/>
                <br/>
                <Input placeholder={'Название'}/>
                <br/>
                <Input placeholder={'Сумма '}/>
            </div>
        </>
    )
}