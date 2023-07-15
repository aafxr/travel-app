import React, {useEffect} from 'react'
import {Link, useNavigate, useParams} from "react-router-dom";
import {PageHeader} from "../../components/ui";
import Container from "../Expenses/components/Container/Container";

import DatePicker from "../../components/DatePicker/DatePicker";
import Swipe from "../../components/ui/Swipe/Swipe";

export default function ExpensesPlan({
                                         user_id,
                                         primary_entity_type,
                                         primary_entity_id
                                     }) {
    const params = useParams()
    const navigate = useNavigate()


    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            navigate('/travel/123/expenses/')
        }
    })

    if (process.env.NODE_ENV === 'production') {
        return null
    }

    return (
        <>
            <Container>
                <PageHeader title={'Главная страница'}/>

                <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    gap: '20px',
                    flexDirection: 'column',
                    letterSpacing: '1px'
                }}>
                    <h2 style={{fontWeight: '900'}}>
                        <b>Опции</b>
                    </h2>
                    <Link to={`/travel/123/expenses/`} style={{color: 'green'}}>Список лимитов</Link>
                    <Link to={`/travel/123/expenses/limit/123`} style={{color: 'green'}}>Редактировать лимит</Link>
                    <Link to={`/travel/123/expenses/plan/`} style={{color: 'green'}}>План расходов</Link>
                    <Link to={`/travel/123/expenses/add/`} style={{color: 'green'}}>Добавить расходы</Link>
                    <Link to={`/travel/123/expenses/plan/add/`} style={{color: 'green'}}>Добавить план расходов</Link>
                    <Link to={`/travel/123/expenses/section/add/`} style={{color: 'green'}}>Добавить секцию</Link>
                    <Link to={`/travel/44/add/`}>Новый маршрут</Link>
                    <Link to={`/travel/44/add/1/`} style={{textDecoration: 'line-through'}}>Направление</Link>

                </div>
                {/*<DatePicker multy onSelect={console.log}/>*/}
                <Swipe ><div style={{height: '100px'}}></div></Swipe>

            </Container>
        </>
    )
}