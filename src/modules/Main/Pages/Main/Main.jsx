import React, {useContext, useEffect, useState} from 'react'
import { useNavigate} from "react-router-dom";
import {PageHeader} from "../../../../components/ui";
import Container from "../../../../components/Container/Container";

import Button from "../../../../components/ui/Button/Button";
import {TravelContext} from "../../../Travel/contextProviders/TravelContextProvider";
import toArray from "../../../../utils/toArray";
import TravelCard from "../../../Travel/components/TravelCard/TravelCard";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import updateTravels from "../../../Travel/helpers/updateTravels";
import useDefaultTravels from "../../../Travel/hooks/useDefaultTravels";
import constants, {USER_AUTH} from "../../../../static/constants";
import Modal from "../../../../components/Modal/Modal";
import TelegramAuth from "../../TelegramAuth";
import {UserContext} from "../../../../contexts/UserContextProvider.jsx";
import Navigation from "../../../../components/Navigation/Navigation";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import {PlusIcon} from "../../../../components/svg";

export default function Main({
                                 primary_entity_type,
                                 primary_entity_id
                             }) {
    const navigate = useNavigate()
    const {travelController} = useContext(TravelContext)
    const {user, setUser} = useContext(UserContext)

    const [travelList, setTravelList] = useState([])
    const [modalVisible, setModalVisible] = useState(!user)

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
        if (travelController && user){
            travelController.write({
                storeName:constants.store.TRAVEL,
                action: "remove",
                user_id: user.id,
                data: travel
            })
                .then(() => pushAlertMessage({type:"success", message: `${travel.title} удфлено.`}))
                .then(()=> setTravelList(travelList.filter(t => t.id !==travel.id)))
                .then(()=> travelController.getStoreModel(constants.store.TRAVEL).remove(travel.id))
        }
    }

    useEffect(() => {
        if (!user){
            const us = JSON.parse(localStorage.getItem(USER_AUTH))
            if(!us){
            setModalVisible(true)
            }else{
                setUser(us)
            }
        }
    }, [user])

    function handleAuth(user){
        console.log(user)
        setModalVisible(false)
        setUser(user)
    }


    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader title={'Главная страница'}/>
                <IconButton
                    border={false}
                    title='+ Добавить'
                    className='link'
                    onClick={() => navigate('/travel/add/')}
                />
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
            <Navigation className='footer' />
            <Modal isVisible={modalVisible} >
                <TelegramAuth handleAuth={handleAuth}/>
            </Modal>
        </div>
    )
}
