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
import YMap from "../../../../api/YMap";
import createId from "../../../../utils/createId";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";

/**
 * Страница отображения компонент добавления места путешествия
 * @function
 * @name TravelAddPlace
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelAddPlace() {
    const user = useUserSelector()
    const {travel, travelObj} = useTravelContext()
    const navigate = useNavigate()
    const [placeName, setPlaceName] = useState('')
    // const [dateRange, setDateRange] = useState(/**@type{DateRangeType}*/{
    //     start: travel.date_start,
    //     end: travel.date_start
    // })

    const [place, setPlace] = useState(/**@type{PlaceType}*/null)

    const [places, setPlaces] = useState(/***@type{PlaceType[]}*/[])

    /**@param{PlaceType} item*/
    function handleSelectPlace(item) {
        const p = places.find(p => p.id === item.id)
        if (p) {
            setPlace({
                ...p,
                _id: createId() + ':' + travelObj.id,
                coords: p.location,
                visited: 0
            })
            setPlaceName(p.name)
        }
    }

    function handleSave() {
        if (place) {
            travel.addPlace({
                    ...place,
                    time_start: new Date(0), //dateRange.start,
                    time_end: new Date(0), //dateRange.end
                }
            )

            travel
                .save(user.id)
                .then(() => pushAlertMessage({
                    type: 'success',
                    message: `
                    <div class="column">
                        <div class="title-semi-bold center">${place.name}</div>
                        <div>Добавлен</div>
                    </div>
                    `
                }))
                .then(() => {
                    setPlaceName('')
                    setPlace(null)
                    setPlaces([])
                })
                .catch(defaultHandleError)
        }
    }


    /** @param {PlaceType[]} placesList */
    function handleSelectedPlaces(placesList){
        const filtered = placesList.filter(p => !travelObj.places.find(tp => tp.id === p.id))
        setPlaces(filtered)
    }

    return (
        <div className='wrapper'>
            <Container className='column gap-1 pb-20'>
                <PageHeader arrowBack title='Добавить локацию'/>
                <div className='column gap-0.25'>
                    <InputWithSuggests
                        type='text'
                        value={placeName}
                        onChange={(e) => setPlaceName(e.target.value)}
                        placeholder='Выберите место'
                        onPlaces={handleSelectedPlaces}
                    />
                    {/*<DateRange*/}
                    {/*    init={dateRange}*/}
                    {/*    minDateValue={travelObj.date_start}*/}
                    {/*    maxDateValue={travelObj.date_end}*/}
                    {/*    onChange={setDateRange}*/}
                    {/*/>*/}
                </div>
                {/*<ul className='row gap-1'>*/}
                {/*    <li><Chip rounded color='grey'>Архитектура</Chip></li>*/}
                {/*    <li><Chip rounded color='grey'>Парки</Chip></li>*/}
                {/*    <li><Chip rounded color='grey'>Экскурсии</Chip></li>*/}
                {/*    <li><Chip rounded color='grey'>Прокат</Chip></li>*/}
                {/*</ul>*/}
            </Container>
            <Container className='content column gap-1 overflow-x-hidden'>
                {
                    Array.isArray(places) && places.map(p => (

                        <LocationCard
                            key={p._id || p.id}
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
