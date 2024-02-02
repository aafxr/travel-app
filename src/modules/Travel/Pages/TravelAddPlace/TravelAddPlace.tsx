import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {useAppContext, useTravel} from "../../../../contexts/AppContextProvider";
import LocationCard from "../../components/LocationCard/LocationCard";
import Container from "../../../../components/Container/Container";
import {fetchPlaces} from "../../../../api/fetch/fetchPlaces";
import Button from "../../../../components/ui/Button/Button";
import {APIPlaceType} from "../../../../types/APIPlaceType";
import {Input, PageHeader} from "../../../../components/ui";
import {TravelService} from "../../../../classes/services";
import {Place} from "../../../../classes/StoreEntities";

type TravelAddPlaceStateType = {
    search: string
    places: APIPlaceType[]
    selected: Map<string, APIPlaceType>
}


/**
 * Страница отображения компонент добавления места путешествия
 * @function
 * @name TravelAddPlace
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelAddPlace() {
    const travel = useTravel()!
    const context = useAppContext()
    const navigate = useNavigate()

    const [state, setState] = useState<TravelAddPlaceStateType>({search: '', places: [], selected: new Map()})


    function handleSelectPlace(item: APIPlaceType) {
        const places_map = state.selected
        if (places_map.has(item.id)) places_map.delete(item.id)
        else places_map.set(item.id, item)
        setState({...state})
    }


    function placeNameChange(name: string) {
        const search = name.trim().toLowerCase()
        if (search)
            fetchPlaces(search)
                .then(list => setState({...state, places: list}))
                .catch(defaultHandleError)
        else if(!search) setState({...state, places:[], search: name})
        else setState({...state, places:[], search: name})
    }


    function handleSave() {
        const list = Array.from(state.selected.values()).map(p => new Place(p))
        TravelService.addPlaces(context, travel, list)
            .then(() => navigate(`/travel/${travel.id}/1/`))
            .catch(defaultHandleError)
    }


    return (
        <div className='wrapper'>
            <Container className='column gap-1 pb-20'>
                <PageHeader arrowBack title='Добавить локацию'/>
                <div className='column gap-0.25'>
                    <Input
                        value={state.search}
                        onChange={placeNameChange}
                        placeholder='Выберите место'
                        delay={300}
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
                    state.places.length
                        ? state.places.map(p => (
                            <LocationCard
                                key={p.id}
                                place={new Place(p)}
                                selected={state.selected.has(p.id)}
                                onAdd={handleSelectPlace}
                            />
                        ))
                        : state.selected.size
                            ? [...state.selected.values()].map(p => (
                                <LocationCard
                                    key={p.id}
                                    place={new Place(p)}
                                    selected={state.selected.has(p.id)}
                                    onAdd={handleSelectPlace}
                                />
                            ))
                            : <div>Введите что хотите посетить</div>
                }
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave}>Добавить</Button>
            </div>
        </div>
    )
}