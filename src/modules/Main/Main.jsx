import React, {useContext, useEffect, useState} from 'react'
import { useNavigate} from "react-router-dom";
import {PageHeader} from "../../components/ui";
import Container from "../../components/Container/Container";

import Button from "../../components/ui/Button/Button";
import {TravelContext} from "../Travel/contextProviders/TravelContextProvider";
import toArray from "../../utils/toArray";
import TravelCard from "../Travel/components/TravelCard/TravelCard";
import {pushAlertMessage} from "../../components/Alerts/Alerts";
import updateTravels from "../Travel/helpers/updateTravels";
import useDefaultTravels from "../Travel/hooks/useDefaultTravels";
import constants from "../../static/constants";

export default function Main({
                                 user_id,
                                 primary_entity_type,
                                 primary_entity_id
                             }) {
    const navigate = useNavigate()
    const {travelController} = useContext(TravelContext)
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

    function handleRemove(travel){
        if (travelController){
            travelController.write({
                storeName:constants.store.TRAVEL,
                action: "remove",
                user_id,
                data: travel
            })
                .then(() => pushAlertMessage({type:"success", message: `${travel.title} удфлено.`}))
                .then(()=> setTravelList(travelList.filter(t => t.id !==travel.id)))
                .then(()=> travelController.getStoreModel(constants.store.TRAVEL).remove(travel.id))
        }
    }



    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader title={'Главная страница'}/>
                <div className='column gap-1 pt-20'>
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
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={() => navigate('/travel/add/')}>Добавить</Button>
            </div>
        </div>
    )
}