import React, {useEffect, useState} from 'react'
import {NavLink, Outlet, useParams} from "react-router-dom";

import ExpensesActionController from "../controllers/ExpensesActionController";
import {PageHeader, Tab} from "../../../components/ui";


export default function ExpensesLayout() {
    const {travelCode} = useParams()


    return (
        <>
            <PageHeader arrowBack title={'Бюджет'}/>
            <div className='content-stretch'>
                <Tab name={'Планы'} to={`/travel/${travelCode}/expenses/plan/`}/>
                <Tab name={'Расходы'} to={`/travel/${travelCode}/expenses/limits/`}/>
            </div>
            <Outlet/>
        </>
    )
}