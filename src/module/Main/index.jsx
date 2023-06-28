import React, { useState} from 'react'
import {Link, useParams} from "react-router-dom";
import {PageHeader} from "../../components/ui";

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


    return (
        <>
            <PageHeader title={'Главная страница'}/>

            <div style={{
                marginTop: '20px',
                padding: '0 20px',
                display: 'flex',
                gap: '20px',
                flexDirection:'column'
            }}>
                <h2>
                    <b>Записать расходы</b>
                </h2>
                <Link to={`/travel/123/expenses/plan/`}>План расходов</Link>
                <Link to={`/travel/123/expenses/add/`}>Добавить расходы</Link>
                <Link to={`/travel/123/expenses/plan/add/`}>Добавить план расходов</Link>
            </div>
        </>
    )
}