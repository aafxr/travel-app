import React from 'react'
import {Outlet, useLocation, useParams} from "react-router-dom";

import {PageHeader, Tab} from "../../../components/ui";
import Container from "../components/Container/Container";


/**
 * обертка для расходов текущих и в планах
 *
 * добовляет табы и заголовок к странице
 * @returns {JSX.Element}
 * @constructor
 */
export default function ExpensesLayout() {
    const {travelCode} = useParams()
    const {pathname} = useLocation()

    const title = pathname.endsWith('plan/') ? 'Планы' : 'Текущие расходы'


    return (
        <div className='expenses-wrapper'>
            <Container>
                <PageHeader arrowBack title={title} to='/'/>
            </Container>
            <div className='content-stretch'>
                <Tab name={'Расходы'} to={`/travel/${travelCode}/expenses/`}/>
                <Tab name={'Планы'} to={`/travel/${travelCode}/expenses/plan/`}/>
            </div>
            <Outlet/>
        </div>
    )
}