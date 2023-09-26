import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";

import Container from "../../../../components/Container/Container";
import defaultHotelData from "../../../../utils/defaultHotelData";
import useChangeInputType from "../../hooks/useChangeInputType";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";
import createAction from "../../../../utils/createAction";
import constants from "../../../../static/constants";
import storeDB from "../../../../db/storeDB/storeDB";
import useTravel from "../../hooks/useTravel";
import ErrorReport from "../../../../controllers/ErrorReport";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";


export default function TravelAddHotel() {
    const navigate = useNavigate()
    const {user} = useSelector(state => state[constants.redux.USER])
    const {travelCode, hotelCode} = useParams()

    const dateHandlers = useChangeInputType('date')
    const timeHandlers = useChangeInputType('date')

    const travel = useTravel(travelCode)
    const [hotel, setHotel] = useState(null)

    //==================================================================================================================
    useEffect(() => {
        if (travel && !hotel) {
            if (hotelCode) {
                const h = travel.hotels.find(h => h.id === hotelCode)
                if (h) setHotel(h)
                else setHotel(defaultHotelData())
            } else setHotel(defaultHotelData())
        }
    }, [travelCode, hotelCode, hotel])

    // handler hotel details ===========================================================================================
    function handleHotelDetailsChange(e, key){
        console.log(e,key)
        if (key in hotel){
            const newHotel = {...hotel}
            newHotel[key] = e.target.value
            setHotel(newHotel)
        }
    }

    function handleSave() {
        if(hotelCode){
            const hidx = travel.hotels.findIndex(h => h.id === hotel.id)
            if (~hidx) {
                const newTravel = {...travel}
                newTravel.hotels[hidx] = hotel
                const action = createAction(constants.store.TRAVEL, user.id, 'update', newTravel)
                Promise.all([
                    storeDB.editElement(constants.store.TRAVEL, newTravel),
                    storeDB.addElement(constants.store.TRAVEL_ACTIONS, action)
                ])
                    .then(() => navigate(-1))
                    .catch(err => {
                        ErrorReport.sendError(err).catch(console.error)
                        pushAlertMessage({type:"warning", message: "Не удалось обновитть путешествие"})
                    })

            }
        }
    }


    return (
        <div className='wrapper'>
            <Container className='column gap-1 pb-20'>
                <PageHeader arrowBack title='Добавить отель'/>
                {
                    hotel
                        ? (
                            <div className='column gap-0.25'>
                                <Input
                                type='text'
                                value={hotel.title}
                                onChange={(e) => handleHotelDetailsChange(e, 'title')}
                                placeholder='Название'
                                />
                                <Input
                                    type='text'
                                    value={hotel.location}
                                    onChange={(e) => handleHotelDetailsChange(e, 'location')}
                                    placeholder='Место'
                                />
                                <div className='flex-stretch gap-0.25'>
                                    <Input
                                        // className='br-right-0'
                                        type='text'
                                        placeholder='Дата'
                                        value={hotel.check_in}
                                        onChange={(e) => handleHotelDetailsChange(e, 'check_in')}
                                        {...dateHandlers}
                                    />
                                    <Input
                                        // className='br-left-0'
                                        type='text'
                                        placeholder='Дата'
                                        value={hotel.check_out}
                                        onChange={(e) => handleHotelDetailsChange(e, 'check_out')}
                                        {...timeHandlers}
                                    />
                                </div>
                            </div>
                        )
                        : (<div>загрузка иформации об отеле</div>)
                }

                <div className='row gap-1'>
                    {/*<Chip rounded color='grey'>Отель</Chip>*/}
                    {/*<Chip rounded color='grey'>Дом</Chip>*/}
                    {/*<Chip rounded color='grey'>Хостел</Chip>*/}
                    {/*<Chip rounded color='grey'>Квартира</Chip>*/}
                    {/*<Chip rounded color='grey'>Комната</Chip>*/}
                </div>
            </Container>
            <Container className='content column gap-1'>
                {/*<LocationCard title='Cosmos Sochi Hotel' imgURL={DEFAULT_IMG_URL} entityType={'отель'}/>*/}
                {/*<LocationCard title='Cosmos Sochi Hotel' imgURL={DEFAULT_IMG_URL} entityType={'отель'}/>*/}
                {/*<LocationCard title='Cosmos Sochi Hotel' imgURL={DEFAULT_IMG_URL} entityType={'отель'}/>*/}
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave}>Добавить</Button>
            </div>
        </div>
    )
}
