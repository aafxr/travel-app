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

export default function TravelRoutes({
                                         primary_entity_type,
                                         primary_entity_id
                                     }) {
    const navigate = useNavigate()
    const {travelController} = useContext(TravelContext)
    const {user, setUser} = useContext(UserContext)

    const [travelList, setTravelList] = useState([])

    useDefaultTravels()

    useEffect(() => {
        if (travelController) {
            travelController.read({
                storeName: constants.store.TRAVEL,
                query: 'all'
            })
                .then(items => setTravelList(toArray(items)))
                .catch(console.error)

            travelController.subscribe(constants.store.TRAVEL, () => {
                updateTravels(travelController).then(setTravelList)
            })
        }
    }, [travelController])

    function handleRemove(travel) {
        if (travelController && user) {
            travelController.write({
                storeName: constants.store.TRAVEL,
                action: "remove",
                user_id: user.id,
                data: travel
            })
                .then(() => pushAlertMessage({type: "success", message: `${travel.title} удфлено.`}))
                .then(() => setTravelList(travelList.filter(t => t.id !== travel.id)))
                .then(() => travelController.getstorageModel(constants.store.TRAVEL).remove(travel.id))
        }
    }

    useEffect(() => {
        if (!user) {
            const us = JSON.parse(localStorage.getItem(USER_AUTH))
            if (us) {
                setUser(us)
            }
        }
    }, [user])

    return (
        <div className='wrapper'>
            <Container>
                <PageHeader title={'Маршруты'} />
            </Container>
            <div className='flex-stretch'>
                <Tab name={'Текущие'} to={'/travels/current/'}/>
                <Tab name={'Будущие'} to={'/travels/plan/'}/>
                <Tab name={'Прошедшие'} to={'/travels/old/'}/>
            </div>
            <Container className='content pt-20'>
                {
                    user
                        ? (
                            <div className='column gap-1'>
                                {
                                    travelList && !!travelList.length && travelList.map(t => (
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
