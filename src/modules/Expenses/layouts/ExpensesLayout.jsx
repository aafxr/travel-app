import React from 'react'
import {Outlet, useParams} from "react-router-dom";

import {PageHeader, Tab} from "../../../components/ui";


/**
 * обертка для расходов текущих и в планах
 *
 * добовляет табы и заголовок к странице
 * @returns {JSX.Element}
 * @constructor
 */
export default function ExpensesLayout() {
    const {travelCode} = useParams()


    return (
        <div className='expenses-wrapper'>
            <PageHeader arrowBack title={'Бюджет'} to='/'/>
            <div className='content-stretch'>
                <Tab name={'Планы'} to={`/travel/${travelCode}/expenses/plan/`}/>
                <Tab name={'Расходы'} to={`/travel/${travelCode}/expenses/limits/`}/>
            </div>
            <Outlet/>
        </div>
    )
}