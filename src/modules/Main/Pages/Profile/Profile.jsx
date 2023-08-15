import React, {useContext, useEffect, useMemo, useState} from "react";

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

import constants, {DEFAULT_IMG_URL, REFRESH_TOKEN} from "../../../../static/constants";
import Accordion from "../../../../components/Accordion/Accordion";
import Loader from "../../../../components/Loader/Loader";
import './Profile.css'
import dateToStringFormat from "../../../../utils/dateToStringFormat";
import aFetch from "../../../../axios";
import Swipe from "../../../../components/ui/Swipe/Swipe";
import storeDB from "../../../../db/storeDB/storeDB";

/**
 * @typedef {object} SessionDataType
 * @property {string} created_at
 * @property {string} created_ip
 * @property {string} created_location
 * @property {string} created_user_agent
 * @property {string} uid
 * @property {string} update_location
 * @property {string} updated_at
 * @property {string} updated_ip
 */



const convertor = {
    "add": "Добавлено",
    "update": "Обновлено",
    "remove": "Удалено",
    [constants.store.EXPENSES_ACTUAL]: 'Расходы(Т)',
    [constants.store.EXPENSES_PLAN]: 'Расходы(П)',
    [constants.store.TRAVEL]: 'Маршрут'
}

export default function Profile() {
    const {user} = useContext(UserContext)
    const [expensesList, setExpensesList] = useState([])
    const [travelsList, setTravelsList] = useState([])
    const [authList, setAuthList] =  useState([])

    useEffect(() => {
        if (user) {
            storeDB.getOne(constants.store.STORE, REFRESH_TOKEN)
                .then(rt => {
                    aFetch.post('/user/auth/getList/',{[REFRESH_TOKEN]: rt.value})
                        .then(res => res.data)
                        .then(({ok, data}) => {
                            console.log({ok, data})
                            ok && setAuthList(data)
                        })
                        .catch(console.error)
                })

        }
    }, [user])

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

    const list = useMemo(() => expensesList.concat(travelsList).sort(
        /**
         * @param {ActionType} a
         * @param {ActionType} b
         */
        (a, b) => b.datetime - a.datetime)
        .map(
            /**
             * @param {ActionType} action
             * @return {*}
             */
            action => {
                const a = {...action}
                a.entity = convertor[a.entity] || ''
                a.action = convertor[a.action] || ''
                a.datetime = dateToStringFormat(a.datetime)
                return a
            }
        ), [expensesList, travelsList])


    /**
     * @param {SessionDataType} auth
     */
    function removeSessionHandler(auth) {
        aFetch.post('/user/auth/remove/',{uid: auth.uid})
            .then((res) =>{
                console.log(res)
                setAuthList(authList.filter(a => a.uid !== auth.uid))
            })
            .catch(console.error)
    }

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
                            !!list.length && (
                                <Accordion title={'Действия'}>
                                    {list.map(e => (
                                        <Accordion.Item key={e.id} title={e.data?.title || ''} icon={<Loader/>}
                                                        dascription={e.entity + ' - ' + e.action} time={e.datetime}/>
                                    ))}
                                </Accordion>
                            )
                        }
                        {!!authList.length &&
                            <Accordion title={'Активные сеансы'}>
                                {authList.map(
                                    /**@param{SessionDataType} a*/
                                    a => (
                                    <Swipe
                                        key={a.uid}
                                        className='auth-item'
                                        onRemove={() => removeSessionHandler(a)}
                                        rightButton
                                    >
                                        <div className='column'>
                                            <div className='auth-info'>{a.updated_ip}</div>
                                            <div className='auth-info'>{a.created_user_agent.split('/').shift()}</div>
                                            {/*<div className='auth-info indistinct'>{new Date(a.updated_at).toLocaleDateString()}</div>*/}
                                        </div>
                                    </Swipe>
                                ))}
                            </Accordion>
                        }
                    </Container>
                </Curtain>
            </div>
            <Navigation className='footer'/>
        </div>
    )
}

const tepl = {
    created_at: "2023-08-10T04:37:31+03:00",
    created_ip: "82.200.95.130",
    created_location: "Novosibirsk",
    created_user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
    uid: "66",
    update_location: "Novosibirsk",
    updated_at: "2023-08-10T04:37:31+03:00",
    updated_ip: "82.200.95.130",
}
