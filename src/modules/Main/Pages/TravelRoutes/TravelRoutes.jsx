import React, { useEffect} from 'react'
import {useNavigate} from "react-router-dom";
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

export default function TravelRoutes({
                                         primary_entity_type,
                                         primary_entity_id
                                     }) {
    const navigate = useNavigate()
    const { travels} = useSelector(state => state[constants.redux.TRAVEL])
    const {user} = useSelector(state => state[constants.redux.USER])
    const dispatch = useDispatch()

    // useDefaultTravels()

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

    useEffect(() => {
        if (!user) {
            const us = JSON.parse(localStorage.getItem(USER_AUTH))
            if (us) {
                dispatch(updateUser(us))
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
            <Container className='content pt-20 pb-20'>
                {
                    user
                        ? (
                            <div className='column gap-1'>
                                {
                                    !!travels.length && travels.map(t => (
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
