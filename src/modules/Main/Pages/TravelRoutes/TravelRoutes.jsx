import React, {useContext, useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";

import TravelCard from "../../../Travel/components/TravelCard/TravelCard";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Navigation from "../../../../components/Navigation/Navigation";
import {UserContext} from "../../../../contexts/UserContextProvider";
import Container from "../../../../components/Container/Container";
import {MS_IN_DAY, USER_AUTH} from "../../../../static/constants";
import ErrorReport from "../../../../controllers/ErrorReport";
import {PageHeader, Tab} from "../../../../components/ui";
import removeTravel from "../../../../utils/removeTravel";
import Travel from "../../../../classes/Travel";
import useUserSelector from "../../../../hooks/useUserSelector";

/**
 * @typedef {'old' | 'current' | 'plan'} TravelDateStatus
 */

/**
 * компонент отображает  маршруты, отсортированные по времени (прошлыые, текущие, будущие)
 * @function
 * @name TravelRoutes
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelRoutes() {
    const navigate = useNavigate()
    const {travelsType} = useParams()
    const [travels, setTravels] = useState(/**@type{TravelType[]} */[])
    const user = useUserSelector()
    /** список отфильтрованных путешествий в соответствии с выбранным табом */
    const [actualTravels, setActualTravels] = useState(/**@type{TravelType[]} */[])

    useEffect(() => {
        if(user) {
            Travel
                .travelList()
                .then(setTravels)
        }
    }, [user])

    /** обновление списка актуальных путешествий */
    useEffect(() => {
        if (travels && travelsType) {
            const filteredTravels = travels.filter(t => getTravelDateStatus(t) === travelsType)
            setActualTravels(filteredTravels)
        }
    }, [travels, travelsType])

    /**
     * обработка удаления путешествия
     * @param {TravelType} travel
     */
    function handleRemove(travel) {
        if (user) {
            /** удаление путешествия из бд и добавление экшена об удалении */
            removeTravel(travel, user.id)
                .then(() => pushAlertMessage({type: "success", message: `${travel.title} удалено.`}))
                .then(() => setTravels(travels.filter(t => t.id !== travel.id)))
                /** обновление global store после успешного удаления */
                // .then(() => dispatch(actions.travelActions.removeTravel(travel)))
                .catch(err => {
                    ErrorReport.sendError(err).catch(console.error)
                    pushAlertMessage({type: 'danger', message: 'Не удалось удалить путешествие'})
                })
        }
    }

    return (
        <div className='wrapper'>
            <Container>
                <PageHeader title={'Маршруты'}/>
            </Container>
            <div className='flex-stretch'>
                <Tab name={'Прошедшие'} to={'/travels/old/'}/>
                <Tab name={'Текущие'} to={'/travels/current/'}/>
                <Tab name={'Будущие'} to={'/travels/plan/'}/>
            </div>
            <Container className='overflow-x-hidden content pt-20 pb-20'>
                {
                    user
                        ? (
                            <ul className='column gap-1'>
                                {
                                    !!actualTravels.length && actualTravels.map(t => (
                                        <li key={t.id}>
                                            <TravelCard
                                                travel={t}
                                                onRemove={() => handleRemove(t)}
                                            />
                                        </li>
                                    ))
                                }
                            </ul>
                        ) : (
                            <IconButton
                                border={false}
                                title='Авторизоваться'
                                className='link'
                                onClick={() => navigate('/login/')}
                            />
                        )
                }
            </Container>
            <Navigation className='footer'/>
        </div>
    )
}


/**
 * функция определяет временной статус путешествия (прошлыые, текущие, будущие)
 * @param {TravelType} travel
 * @returns {TravelDateStatus}
 */
function getTravelDateStatus(travel) {
    if (!travel) return "old"
    const msInDay = MS_IN_DAY // число милисекунд в сутках
    const now = Date.now()
    /** время, прошедшее с начала суток */
    const dayOffset = now % msInDay

    if (travel.date_end && new Date(travel.date_end).getTime() < now - dayOffset) {
        return "old"
    } else if (travel.date_start
        && new Date(travel.date_start).getTime() > (now + (msInDay - dayOffset))) {
        return "plan"
    }
    return "current"
}