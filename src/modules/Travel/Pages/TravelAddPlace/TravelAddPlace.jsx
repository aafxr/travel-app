import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {Chip, InputWithSuggests, PageHeader} from "../../../../components/ui";
import LocationCard from "../../components/LocationCard/LocationCard";
import Container from "../../../../components/Container/Container";
import DateRange from "../../../../components/DateRange/DateRange";
import useTravelContext from "../../../../hooks/useTravelContext";
import useUserSelector from "../../../../hooks/useUserSelector";
import Button from "../../../../components/ui/Button/Button";
import {DEFAULT_IMG_URL} from "../../../../static/constants";
import YMap from "../../../../classes/YMap";

/**
 * Страница отображения компонент добавления места путешествия
 * @function
 * @name TravelAddPlace
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelAddPlace() {
    const {user} = useUserSelector()
    const {travel} = useTravelContext()
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [dateRange, setDateRange] = useState(/**@type{DateRangeType}*/{
        start: travel.date_start,
        end: travel.date_start
    })

    const [place, setPlace] = useState(/**@type{PlaceType}*/null)

    const [places, setPlaces] = useState(/***@type{PlaceType[]}*/[])

    /**@param{PlaceType} item*/
    function handleSelectPlace(item) {
        const p = places.find(p => p.id === item.id)
        if (p) {
            setPlace({
                ...p,
                _id: p.id + ':' + travel.id,
                coords: [+p.location.lat, +p.location.lng],
                visited: 0
            })
            setTitle(p.name)
        }
    }

    function handleSave() {
        if (place) {
            console.log(place)
            travel.addPlace({
                    ...place,
                    date_start: dateRange.start,
                    date_end: dateRange.end
                }
            )

            const extractPlaceDataCB =
                /**@param {PlaceType} p */
                    (p) => {
                    const {id, location: {lat, lng}} = p
                    return {id, coords: [+lat, +lng]}
                }
            const sortedPlaces = travel.routeBuilder
                    .sortPlacesByDistance(travel.places, extractPlaceDataCB, YMap.getDistance)

            travel.setPlaces(sortedPlaces)

            travel
                .save(user.id)
                .then(() => navigate(-1))
                .catch(defaultHandleError)
        }
    }

    return (
        <div className='wrapper'>
            <Container className='column gap-1 pb-20'>
                <PageHeader arrowBack title='Добавить локацию'/>
                <div className='column gap-0.25'>
                    <InputWithSuggests
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Выберите место'
                        onPlaces={setPlaces}
                    />
                    <DateRange
                        init={dateRange}
                        minDateValue={travel.date_start}
                        maxDateValue={travel.date_end}
                        onChange={setDateRange}
                    />
                </div>
                <ul className='row gap-1'>
                    <li><Chip rounded color='grey'>Архитектура</Chip></li>
                    <li><Chip rounded color='grey'>Парки</Chip></li>
                    <li><Chip rounded color='grey'>Экскурсии</Chip></li>
                    <li><Chip rounded color='grey'>Прокат</Chip></li>
                </ul>
            </Container>
            <Container className='content column gap-1 overflow-x-hidden'>
                {
                    Array.isArray(places) && places.map(p => (

                        <LocationCard
                            key={p.id}
                            id={p.id}
                            title={p.name}
                            imgURLs={p.photos || [DEFAULT_IMG_URL]}
                            entityType={p.formatted_address}
                            selected={p.id === place?.id}
                            item={p}
                            onAdd={handleSelectPlace}
                        />
                    ))
                }
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave}>Добавить</Button>
            </div>
        </div>
    )
}
