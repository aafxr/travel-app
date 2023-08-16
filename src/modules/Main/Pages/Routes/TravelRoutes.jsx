import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {PageHeader, Tab} from "../../../../components/ui";
import Container from "../../../../components/Container/Container";

import {TravelContext} from "../../../Travel/contextProviders/TravelContextProvider";
import toArray from "../../../../utils/toArray";
import TravelCard from "../../../Travel/components/TravelCard/TravelCard";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import updateTravels from "../../../Travel/helpers/updateTravels";
import useDefaultTravels from "../../../Travel/hooks/useDefaultTravels";
import constants, {USER_AUTH} from "../../../../static/constants";
import {UserContext} from "../../../../contexts/UserContextProvider.jsx";
import Navigation from "../../../../components/Navigation/Navigation";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import {useDispatch, useSelector} from "react-redux";
import travelDB from "../../../../db/travelDB/travelDB";
import createAction from "../../../../utils/createAction";
import {actions} from "../../../../redux/store";

export default function TravelRoutes({
                                         primary_entity_type,
                                         primary_entity_id
                                     }) {
    const navigate = useNavigate()
    const {travelController, travels} = useSelector(state => state[constants.redux.TRAVEL])
    const {user} = useSelector(state => state[constants.redux.USER])
    const dispatch = useDispatch()

    useDefaultTravels()

    function handleRemove(travel) {
        if (travelController && user) {
            Promise.all([
            travelDB.removeElement(constants.store.TRAVEL, travel.id),
            travelDB.editElement(
                constants.store.TRAVEL_ACTIONS,
                createAction(constants.store.TRAVEL, user.id, 'remove', travel)
                )
                .then(() => pushAlertMessage({type: "success", message: `${travel.title} удфлено.`}))
                .then(() => dispatch(actions.travelActions.removeTravels(travels)))
            ]).catch(console.error)
        }
    }

    useEffect(() => {
        if (!user) {
            const us = JSON.parse(localStorage.getItem(USER_AUTH))
            if (us) {
                dispatch(actions.userActions.updateUser(us))
            }
        }
    }, [user])

    return (
        <div className='wrapper'>
            <Container>
                <PageHeader title={'Маршруты'} />
            </Container>
            <div className='flex-stretch'>
                <Tab name={'Прошедшие'} to={'/travels/old/'}/>
                <Tab name={'Текущие'} to={'/travels/current/'}/>
                <Tab name={'Будущие'} to={'/travels/plan/'}/>
            </div>
            <Container className='content pt-20'>
                {
                    user
                        ? (
                            <div className='column gap-1'>
                                {
                                    !!travels.length && travels.map(t => (
                                        <TravelCard
                                            key={t.id}
                                            id={t.id}
                                            title={t.title}
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
