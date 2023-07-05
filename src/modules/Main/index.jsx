import React, { useState} from 'react'
import {Link, useParams} from "react-router-dom";
import {PageHeader} from "../../components/ui";
import Checkbox from "../../components/ui/Checkbox/Checkbox";

export default function ExpensesPlan({
                                         user_id,
                                         primaryEntityType,
                                         primary_entity_id
                                     }) {
    const params = useParams()


    return (
        <>
            <PageHeader title={'Главная страница'}/>

            <div style={{
                marginTop: '20px',
                padding: '0 20px',
                display: 'flex',
                gap: '20px',
                flexDirection:'column',
                letterSpacing: '1px'
            }}>
                <h2 style={{fontWeight: '900'}}>
                    <b>Опции</b>
                </h2>
                <Link to={`/travel/123/expenses/limits/`} style={{color: 'green'}}>Список лимитов</Link>
                <Link to={`/travel/123/expenses/limit/123`} style={{color: 'green'}}>Редактировать лимит</Link>
                <Link to={`/travel/123/expenses/plan/`} style={{color: 'green'}}>План расходов</Link>
                <Link to={`/travel/123/expenses/add/`} style={{color: 'green'}}>Добавить расходы</Link>
                <Link to={`/travel/123/expenses/plan/add/`} style={{color: 'green'}} >Добавить план расходов</Link>
                <Link to={`/travel/123/expenses/section/add/`} style={{color: 'green'}}>Добавить секцию</Link>
                <Link to={`/travel/44/add/`} >Новый маршрут</Link>
                <Link to={`/travel/44/add/1/`} style={{textDecoration: 'line-through'}}>Направление</Link>
        </div>
        </>
    )
}