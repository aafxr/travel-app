import React, {useEffect, useMemo, useState} from "react";

import dateToStringFormat from "../../../../utils/dateToStringFormat";
import Container from "../../../../components/Container/Container";
import ListItem from "../../../../components/ListItem/ListItem";
import errorReport from "../../../../controllers/ErrorReport";
import Loader from "../../../../components/Loader/Loader";
import constants from "../../../../static/constants";
import storeDB from "../../../../classes/db/storeDB/storeDB";
import {PageHeader} from "../../../../components/ui";
import {CheckIcon} from "../../../../components/svg";


const convertor = {
    "add": "Добавлен",
    "update": "Обновлен",
    "remove": "Удален",
    [constants.store.EXPENSES_ACTUAL]: 'Расходы(Т)',
    [constants.store.EXPENSES_PLAN]: 'Расходы(П)',
    [constants.store.LIMIT]: 'Лимит',
    [constants.store.TRAVEL]: 'Маршрут'
}

/**
 * страница отображения последних действий
 * @function
 * @name ActionsList
 * @returns {JSX.Element}
 * @category Pages
 */
export default function ActionsList() {
    const [expensesList, setExpensesList] = useState([])
    const [travelsList, setTravelsList] = useState([])

    useEffect(() => {
        async function onExpenses() {
            const expensesActions = await storeDB.getAll(constants.store.EXPENSES_ACTIONS)
            expensesActions && setExpensesList(expensesActions)
        }

        async function onTravel() {
            const travelActions = await storeDB.getAll(constants.store.TRAVEL_ACTIONS)
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


    return (
        <Container>
            <PageHeader arrowBack title='Действия'/>
            {
                !!list.length && list.map(e => (
                        <ListItem
                            key={e.id}
                            topDescription={e.entity + ' - ' + e.action}
                            time={e.datetime}
                            icon={e.synced ? <CheckIcon success /> : <Loader/>}
                        >
                            {e.data.title || e.data.value || ''}
                        </ListItem>
                    )
                )
            }
        </Container>
    )
}