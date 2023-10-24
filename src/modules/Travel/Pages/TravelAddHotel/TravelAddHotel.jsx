import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Container from "../../../../components/Container/Container";
import DateRange from "../../../../components/DateRange/DateRange";
import defaultHotelData from "../../../../utils/defaultHotelData";
import ErrorReport from "../../../../controllers/ErrorReport";
import Button from "../../../../components/ui/Button/Button";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import constants, {DEFAULT_IMG_URL} from "../../../../static/constants";
import {actions} from "../../../../redux/store";
import useTravel from "../../hooks/useTravel";
import saveTravel from "../../../../utils/saveTravel";
import LocationCard from "../../components/LocationCard/LocationCard";
import InputWithPlaces from "../../../../components/ui/InputWithSuggests/InputWithPlaces";
import PhotoCarousel from "../../../../components/PhotoCarousel/PhotoCarousel";


/**
 * Страница добавления отеля
 * @function
 * @name TravelAddHotel
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelAddHotel() {
    const navigate = useNavigate()
    const {user} = useSelector(state => state[constants.redux.USER])
    const dispatch = useDispatch()
    const {hotelCode} = useParams()

    const {travel, errorMessage} = useTravel()
    const [hotel, setHotel] = useState(/**@type{HotelType | null} */null)
    const [hotels, setHotels] = useState(/**@type{HotelType | null} */null)

    const [places, setPlaces] = useState(/***@type{PlaceType[]}*/[]);

    // useEffect(() => {
    //     if (travel) {
    //         aFetch.get('hotels')
    //             .then(res => res?.statusText === 'OK' ? res.data : [])
    //             .then(h => setHotels(h))
    //             .catch(console.error)
    //     }
    // }, [travel])

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
        if (!travel || !travel.hotels) {
            pushAlertMessage({type: "warning", message: 'Ошибка при добавление отеля'})
            return
        }

        /** клон travel (поскольку travel immutable ) */
        const newTravel = {...travel}
        /** клон массива для обновления данных данных об отеле */
        newTravel.hotels = [...newTravel.hotels]
        /** если отель уж существует в travel.hotels, то перезаписываем данные значением hotel, иначе добовляем отель в список */
        const hidx = travel?.hotels.findIndex(h => h.id === hotel.id)
        if (hotelCode && hidx !== -1) newTravel.hotels[hidx] = hotel
        else newTravel.hotels.push(hotel)

        /** обновляем данные сущности travel и добовляем action в бд */
        saveTravel(newTravel, user.id)
            .then(() => navigate(-1))
            /** обновление информации об отеле в глобальном хранилище */
            .then(() => dispatch(actions.travelActions.addHotel(hotel)))
            .catch(err => {
                ErrorReport.sendError(err).catch(console.error)
                pushAlertMessage({type: "warning", message: "Не удалось обновитть путешествие"})
            })
    }

    /** обработчик изменения диапазона дат заселения в отель */
    function handleHotelRangeChange({start, end}) {
        if (hotel) {
            if (hotel.check_in !== start) dispatch(actions.travelActions.addHotel({...hotel, check_in: start}))
            if (hotel.check_out !== end) dispatch(actions.travelActions.addHotel({...hotel, check_out: end}))
        }
    }

    console.log(places)
    return (
        <div className='wrapper'>
            <Container className='column gap-1 pb-20'>
                <PageHeader arrowBack title='Добавить отель'/>
                {
                    hotel
                        ? (
                            <div className='column gap-0.25'>
                                <InputWithPlaces
                                    type='text'
                                    value={hotel.title}
                                    onChange={(e) => handleHotelDetailsChange(e, 'title')}
                                    placeholder='Название'
                                    onPlaces={setPlaces}
                                />
                                {
                                    !!travel && !!travel.waypoints && travel.waypoints.length > 1 && (
                                        <>
                                            <Input
                                                type='text'
                                                value={hotel.location}
                                                onChange={(e) => handleHotelDetailsChange(e, 'location')}
                                                placeholder='Место'
                                            />
                                            <div className='row gap-0.25'>
                                                { travel.waypoints.map(w => (
                                                    <Chip
                                                        color={hotel.location === w.point.locality ? "orange" : "grey"}
                                                        onClick={() => handleHotelDetailsChange({target:{value: w.point.locality}}, 'location')}
                                                        rounded
                                                    >
                                                        {w.point.locality}
                                                    </Chip>))
                                                }
                                            </div>
                                        </>
                                    )
                                }
                                <DateRange
                                    init={{start: travel.date_start, end: travel.date_end}}
                                    minDateValue={travel.date_start}
                                    maxDateValue={travel.date_end}
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
            <Container className='content column gap-1 pt-20 pb-20'>
                {/*{*/}
                {/*    Array.isArray(hotels) && hotels.length > 0 && hotels.map(h => (*/}
                {/*        <LocationCard key={h.id} title={h.label} imgURL={DEFAULT_IMG_URL} entityType={'отель'}/>*/}
                {/*    ))*/}
                {/*}*/}
                {
                    Array.isArray(places) && places.map(p => (
                        <LocationCard
                            key={p.formatted_address}
                            title={p.name}
                            imgURLs={p.photos || [DEFAULT_IMG_URL]}
                            entityType={p.formatted_address}
                        />
                    ))
                }
            </Container>
            <div className='footer-btn-container footer'>
                <Button
                    onClick={handleHotelSave}
                    disabled={!hotel || !hotel.title || (travel.waypoints.length > 1 ? !hotel.location : false) || !hotel.check_in || !hotel.check_out}
                >Добавить</Button>
            </div>
        </div>
    )
}
