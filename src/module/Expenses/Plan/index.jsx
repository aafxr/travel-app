import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import distinctValues from "../../../utils/distinctValues";

import ExpensesActionController from '../../Expenses/controllers/ExpensesActionController'
import {LocalDB} from "../../../db";
import schema from '../db/schema'

import AddButton from "../components/AddButtom/AddButton";
import Line from "../components/Line/Line";
import {Input, PageHeader, Tab} from "../../../components/ui";

export default function ExpensesPlan({
                                         user_id,
                                         primaryEntityType,
                                         primary_entity_id
                                     }) {
    const params = useParams()
    console.log(params)
    const [db, setDb] = useState(null)
    const [dbReady, setDbReady] = useState(false)
    const [idCounter, setIdCounter] = useState(0)
    const [controller, setController] = useState(null)
    const [sections, setSections] = useState([])
    const [expenses, setExpenses] = useState([])

    useEffect(() => {
        setDb(new LocalDB(
            schema,
            {
                onReady: (db) => {
                    console.log(db)
                    setDbReady(true)
                    setController(new ExpensesActionController(db, user_id, '123'))
                },
                onError: console.error
            }))
    }, [])

    useEffect(() => {
        if (controller) {
            controller.sectionModel.get('all')
                .then(items => distinctValues(items, item => item.id))
                .then(items => setSections(items))
                .catch(console.error)
        }
    }, [controller])

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
            <PageHeader arrowBack title={'Expenses'}/>
            <div style={{display: 'flex', justifyContent: 'stretch', width: '100%'}}>
                <Tab name={'Планы'} active/>
                <Tab name={'Расходы'}/>
            </div>
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