import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import TravelCard from "../../../Travel/components/TravelCard/TravelCard";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Navigation from "../../../../components/Navigation/Navigation";
import Container from "../../../../components/Container/Container";
import constants, {USER_AUTH} from "../../../../static/constants";
import {updateUser} from "../../../../redux/userStore/updateUser";
import {PageHeader, Tab} from "../../../../components/ui";
import createAction from "../../../../utils/createAction";
import storeDB from "../../../../db/storeDB/storeDB";
import {actions} from "../../../../redux/store";

/**
 * @typedef {'old' | 'current' | 'plan'} TravelDateStatus
 */

/**
 * компонент отображает  маршруты, отсортированные по времени (прошлыые, текущие, будущие)
 * @returns {JSX.Element}
 * @constructor
 */


export default function TravelRoutes({
                                         primary_entity_type,
                                         primary_entity_id
                                     }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {travelsType} = useParams()
    const {travels} = useSelector(state => state[constants.redux.TRAVEL])
    const {user} = useSelector(state => state[constants.redux.USER])
    /** список отфильтрованных путешествий в соответствии с выбранным табом */
    const [actualTravels, setActualTravels] = useState(/**@type{TravelType[]} */[])

    /** обновление списка актуальных путешествий */
    useEffect(() => {
        if (travels && travelsType){
            const filteredTravels = travels.filter(t => getTravelDateStatus(t) === travelsType)
            setActualTravels(filteredTravels)
        }
    }, [travels, travelsType])

    useEffect(() => {
        if (!user) {
            const us = JSON.parse(localStorage.getItem(USER_AUTH))
            if (us) dispatch(updateUser(us))
        }
    }, [user])

    function handleRemove(travel) {
        if (user) {
            /** удаление путешествия из бд и добавление экшена об удалении */
            Promise.all([
                storeDB.removeElement(constants.store.TRAVEL, travel.id),
                storeDB.editElement(constants.store.TRAVEL_ACTIONS, createAction(constants.store.TRAVEL, user.id, 'remove', travel))
                    .then(() => pushAlertMessage({type: "success", message: `${travel.title} удалено.`}))
                    .then(() => dispatch(actions.travelActions.removeTravel(travels)))
            ])
                /** обновление global store после успешного удаления */
                .then(() => dispatch(actions.travelActions.removeTravel(travel)))
                .catch(console.error)
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
                            <div className='column gap-1'>
                                {
                                    !!actualTravels.length && actualTravels.map(t => (
                                        <TravelCard
                                            key={t.id}
                                            travel={t}
                                            onRemove={() => handleRemove(t)}
                                        />
                                    ))
                                }
                            </div>
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
    if(!travel) return "old"
    const msInDay = 1000 * 60 * 60 * 24 // число милисекунд в сутках
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