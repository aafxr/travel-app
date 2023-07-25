import React, {useContext, useEffect, useState} from 'react'
import { useNavigate} from "react-router-dom";
import {PageHeader} from "../../components/ui";
import Container from "../Expenses/components/Container/Container";

import Button from "../../components/ui/Button/Button";
import {TravelContext} from "../Travel/contextProviders/TravelContextProvider";
import constants from "../Travel/db/constants";
import toArray from "../../utils/toArray";
import TravelCard from "../Travel/components/TravelCard/TravelCard";
import createAction from "../../utils/createAction";
import {pushAlertMessage} from "../../components/Alerts/Alerts";
import updateTravels from "../Travel/helpers/updateTravels";

export default function Main({
                                 user_id,
                                 primary_entity_type,
                                 primary_entity_id
                             }) {
    const navigate = useNavigate()
    const {travelController} = useContext(TravelContext)
    const [travelList, setTravelList] = useState([])


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

    function handleRemove(id, title){
        if (travelController){
            travelController.write({
                storeName:constants.store.TRAVEL,
                action: "remove",
                user_id,
                data: {id}
            })
                .then(() => pushAlertMessage({type:"success", message: `${title} удфлено.`}))
                .then(()=> setTravelList(travelList.filter(t => t.id !==id)))
                .then(()=> travelController.getStoreModel(constants.store.TRAVEL).remove(id))
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
                                to={`/travel/${t.id}/expenses/`}
                                title={t.title}
                                onRemove={() => handleRemove(t.id, t.title)}
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