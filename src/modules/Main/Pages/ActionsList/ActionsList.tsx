import React, {useEffect, useMemo, useState} from "react";

import dateToStringFormat from "../../../../utils/dateToStringFormat";
import Container from "../../../../components/Container/Container";
import ListItem from "../../../../components/ListItem/ListItem";
import Loader from "../../../../components/Loader/Loader";
import {PageHeader} from "../../../../components/ui";
import {CheckIcon} from "../../../../components/svg";
import {DB} from "../../../../classes/db/DB";
import {StoreName} from "../../../../types/StoreName";
import {ActionName, ActionType} from "../../../../types/ActionsType";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";


const consvertActionName: { [key: string]: string } = {
    [ActionName.ADD]: "Добавлен",
    [ActionName.UPDATE]: "Обновлен",
    [ActionName.DELETE]: "Удален",
}
const convertorStoreName: { [key: string]: string } = {

    [StoreName.EXPENSES_ACTUAL]: 'Расходы(Т)',
    [StoreName.EXPENSES_PLAN]: 'Расходы(П)',
    [StoreName.EXPENSE]: 'Расходы',
    [StoreName.LIMIT]: 'Лимит',
    [StoreName.TRAVEL]: 'Маршрут'
}

/**
 * страница отображения последних действий
 * @function
 * @name ActionsList
 * @returns {JSX.Element}
 * @category Pages
 */
export default function ActionsList() {
    const [actions, setActions] = useState<ActionType[]>([])

    useEffect(() => {
        DB.getAll<ActionType>(StoreName.ACTION, 200)
            .then(setActions)
            .catch(defaultHandleError)
    }, [])

    const list = useMemo(() => actions.sort(
        (a, b) => b.datetime.getTime() - a.datetime.getTime())
        .map(
            action => {
                const a = {...action}
                a.entity = (convertorStoreName[a.entity] || '') as StoreName
                a.action = (consvertActionName[a.action] || '') as ActionName
                return a
            }
        ), [actions])


    return (
        <Container>
            <PageHeader arrowBack title='Действия'/>
            {
                !!list.length && list.map(e => (
                        <ListItem
                            key={e.id}
                            topDescription={e.entity + ' - ' + e.action}
                            time={e.datetime}
                            icon={e.synced ? <CheckIcon success/> : <Loader/>}
                        >
                            {e.data.title || e.data.value || ''}
                        </ListItem>
                    )
                )
            }
        </Container>
    )
}