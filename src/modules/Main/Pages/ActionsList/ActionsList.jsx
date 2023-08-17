import React, {useEffect, useMemo, useState} from "react";
import expensesDB from "../../../../db/expensesDB/expensesDB";
import constants from "../../../../static/constants";
import travelDB from "../../../../db/travelDB/travelDB";
import errorReport from "../../../../controllers/ErrorReport";
import dateToStringFormat from "../../../../utils/dateToStringFormat";
import Loader from "../../../../components/Loader/Loader";
import {PageHeader} from "../../../../components/ui";
import Container from "../../../../components/Container/Container";
import ChecklistIconIcon from "../../../../components/svg/ChecklistIconIcon";

import './ActionsList.css'

const convertor = {
    "add": "Добавлен",
    "update": "Обновлен",
    "remove": "Удален",
    [constants.store.EXPENSES_ACTUAL]: 'Расходы(Т)',
    [constants.store.EXPENSES_PLAN]: 'Расходы(П)',
    [constants.store.LIMIT]: 'Лимит',
    [constants.store.TRAVEL]: 'Маршрут'
}

export default function ActionsList() {
    const [expensesList, setExpensesList] = useState([])
    const [travelsList, setTravelsList] = useState([])

    useEffect(() => {
        async function onExpenses() {
            const expensesActions = await expensesDB.getManyFromIndex(
                constants.store.EXPENSES_ACTIONS,
                constants.indexes.SYNCED,
                0)
            expensesActions && setExpensesList(expensesActions)
        }

        async function onTravel() {
            const travelActions = await travelDB.getManyFromIndex(
                constants.store.TRAVEL_ACTIONS,
                constants.indexes.SYNCED,
                0)
            travelActions && setTravelsList(travelActions)
        }

        Promise.all([onExpenses(), onTravel()])
            .catch(err => {
                errorReport.sendReport().catch(console.error)
                console.error(err)
            })
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

    console.log(list)

    return (
        <Container>
            <PageHeader arrowBack title='Действия'/>
            {

                !!list.length && list.map(e => (
                        <div className='action-item flex-between '>
                            <div className='column'>
                                <div className='action-item-description'>{e.entity + ' - ' + e.action}</div>
                                <div className='action-item-title'>{e.data.title || e.data.value || ''}</div>
                            </div>
                            <div className='action-item-time'>{e.datetime}</div>
                            <span className='action-item-icon'>{e.synced ? <Loader/> : <ChecklistIconIcon/>}</span>
                        </div>
                    )
                )
            }
        </Container>
    )
}