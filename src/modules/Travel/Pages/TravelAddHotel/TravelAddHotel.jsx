import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Container from "../../../../components/Container/Container";
import DateRange from "../../../../components/DateRange/DateRange";
import defaultHotelData from "../../../../utils/defaultHotelData";
import ErrorReport from "../../../../controllers/ErrorReport";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";
import createAction from "../../../../utils/createAction";
import constants from "../../../../static/constants";
import storeDB from "../../../../db/storeDB/storeDB";
import {actions} from "../../../../redux/store";
import useTravel from "../../hooks/useTravel";


export default function TravelAddHotel() {
    const navigate = useNavigate()
    const {user} = useSelector(state => state[constants.redux.USER])
    const dispatch = useDispatch()
    const { hotelCode} = useParams()

    const {travel, errorMessage} = useTravel()
    const [hotel, setHotel] = useState(/**@type{HotelType | null} */null)

    //==================================================================================================================
    /** инициализация переменн hotel */
    useEffect(() => {
        if (travel && !hotel) {
           /** если url содержит hotelCode (т.е редактируем данные об отеле) ищем в travel данные о путешествии */
            if (hotelCode) {
                /** @type{HotelType | undefined} */
                const h = travel?.hotels.find(h => h.id === hotelCode)
                if (h) setHotel(h)
                    /** если информация об отеле в сущности travel не найдена, то создаем новый отель с id hotelCode */
                else setHotel(defaultHotelData(hotelCode))
                /** если нет hotelCode, значит добавляются данные о новом отеле */
            } else setHotel(defaultHotelData())
        }
    }, [hotelCode, travel, hotel])

    // handler hotel details ===========================================================================================
    /**
     * обработчик, обновляет данные hotel по ключу key
     * @param {InputEvent} e
     * @param {string} key - ключ из hotel, по которому планируется обновлять данные полученные в event e
     */
    function handleHotelDetailsChange(e, key) {
        if (key in hotel) {
            const newHotel = {...hotel}
            newHotel[key] = e.target.value
            setHotel(newHotel)
        }
    }

    //==================================================================================================================
    /** сохранение информации об отеле и перенаправление пользователя */
    function handleHotelSave() {
        if(!travel || !travel.hotels) {
            pushAlertMessage({type: "warning", message: 'Ошибка при добавление отеля'})
            return
        }

        /** клон travel (поскольку travel immutable ) */
        const newTravel = {...travel}
        /** клон массива для обновления данных данных об отеле */
        newTravel.hotels = [...newTravel.hotels]
        /** если отель уж существует в travel.hotels, то перезаписываем данные значением hotel, иначе добовляем отель в список */
        const hidx = travel?.hotels.findIndex(h => h.id === hotel.id)
        if (hotelCode && hidx !== -1)  newTravel.hotels[hidx] = hotel
        else newTravel.hotels.push(hotel)

        const action = createAction(constants.store.TRAVEL, user.id, 'update', newTravel)
        /** обновляем данные сущности travel и добовляем action в бд */
        Promise.all([
            storeDB.editElement(constants.store.TRAVEL, newTravel),
            storeDB.addElement(constants.store.TRAVEL_ACTIONS, action)
        ])
            .then(() => navigate(-1))
            /** обновление информации об отеле в глобальном хранилище */
            .then(() => dispatch(actions.travelActions.addHotel(hotel)))
            .catch(err => {
                ErrorReport.sendError(err).catch(console.error)
                pushAlertMessage({type: "warning", message: "Не удалось обновитть путешествие"})
            })
    }

    /** обработчик изменения диапазона дат заселения в отель */
    function handleHotelRangeChange({start, end}){
        if(hotel){
            if (hotel.check_in !== start) dispatch(actions.travelActions.addHotel({...hotel, check_in:start}))
            if (hotel.check_out !== end) dispatch(actions.travelActions.addHotel({...hotel, check_out:end}))
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
                                <DateRange
                                    minDateValue={travel.date_start}
                                    startValue={hotel.check_in}
                                    endValue={hotel.check_out}
                                    onChange={handleHotelRangeChange}
                                />
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
                <Button
                    onClick={handleHotelSave}
                    disabled={!hotel || !hotel.title || !hotel.location || !hotel.check_in || !hotel.check_out}
                >Добавить</Button>
            </div>
        </div>
    )
}
