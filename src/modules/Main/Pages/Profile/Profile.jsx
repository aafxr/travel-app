import React, {useContext, useEffect, useState} from "react";

import Navigation from "../../../../components/Navigation/Navigation";
import {UserContext} from "../../../../contexts/UserContextProvider";
import Container from "../../../../components/Container/Container";
import Curtain from "../../../../components/Curtain/Curtain";
import Menu from "../../../../components/Menu/Menu";
import {PageHeader} from "../../../../components/ui";

import expensesController from "../../../Expenses/controllers/expensesController";
import expensesActionModel from "../../../Expenses/models/expensesActionModel/expensesActionModel";
import travelActionModel from "../../../Travel/models/travelActionModel/travelActionModel";
import travelController from "../../../Travel/controllers/travelController";
import errorReport from "../../../../controllers/ErrorReport";

import constants, {DEFAULT_IMG_URL} from "../../../../static/constants";
import Accordion from "../../../../components/Accordion/Accordion";
import Loader from "../../../../components/Loader/Loader";
import './Profile.css'

export default function Profile() {
    const {user} = useContext(UserContext)
    const [expensesList, setExpensesList] = useState([])
    const [travelsList, setTravelsList] = useState([])

    useEffect(() => {
        async function onExpenses() {
            const expensesActions = await expensesActionModel.getFromIndex(constants.indexes.SYNCED, 0)
            expensesActions && setExpensesList(expensesActions)
        }

        async function onTravel() {
            const travelActions = await travelActionModel.getFromIndex(constants.indexes.SYNCED, 0)
            travelActions && setTravelsList(travelActions)
        }

        Promise.all([onExpenses(), onTravel()])
            .catch(err => {
                errorReport.sendReport().catch(console.error)
                console.error(err)
            })

        expensesController.subscribe(constants.store.EXPENSES_ACTUAL, onExpenses)
        expensesController.subscribe(constants.store.EXPENSES_PLAN, onExpenses)
        travelController.subscribe(constants.store.TRAVEL, onTravel)

        return () => {
            expensesController.unsubscribe(constants.store.EXPENSES_ACTUAL, onExpenses)
            expensesController.unsubscribe(constants.store.EXPENSES_PLAN, onExpenses)
            travelController.unsubscribe(constants.store.TRAVEL, onTravel)
        }
    }, [])


    return (
        <div className='wrapper'>
            <div className='content hide-scroll'>
                <Container className='header-fixed'>
                    <PageHeader arrowBack MenuEl={<Menu/>}/>
                </Container>
                <div className='profile-backside column gap-1 pt-20'>
                    <div className='title title-bold center'>Профиль</div>
                    <div className='profile-image center'>
                        <img src={user?.photo || DEFAULT_IMG_URL} alt="Фото"/>
                    </div>
                    <div className='profile-user-name center'>
                        <span>{user?.first_name}</span>&nbsp;
                        <span>{user?.last_name}</span>
                    </div>
                </div>
                <Curtain minOffset={54} maxOpenPercent={.6} defaultOffsetPercents={.6}>
                    <Container className='pt-20'>
                        {
                            !!expensesList.length && (
                                <Accordion title={'Расходы'}>
                                    {expensesList.map(e => (
                                        <Accordion.Item key={e.id} title={e.data?.title || ''} icon={<Loader/>}/>
                                    ))}
                                </Accordion>
                            )
                        }
                        {
                            !!travelsList.length && (
                                <Accordion title={'Маршруты'}>
                                    {travelsList.map(e => (
                                        <Accordion.Item key={e.id} title={e.data?.title || ''} icon={<Loader/>}/>
                                    ))}
                                </Accordion>
                            )
                        }
                    </Container>
                </Curtain>
            </div>
            <Navigation className='footer'/>
        </div>
    )
}
