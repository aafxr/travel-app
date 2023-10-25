import React, {useState} from "react";
import {useParams} from "react-router-dom";

import {Chip, Input, InputWithSuggests, PageHeader} from "../../../../components/ui";
import LocationCard from "../../components/LocationCard/LocationCard";
import Container from "../../../../components/Container/Container";
import useChangeInputType from "../../hooks/useChangeInputType";
import Button from "../../../../components/ui/Button/Button";
import {DEFAULT_IMG_URL} from "../../../../static/constants";
import Swipe from "../../../../components/ui/Swipe/Swipe";

/**
 * Страница отображения локации
 * @function
 * @name TravelAddLocation
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelAddLocation() {
    const {travelCode} = useParams()
    const dateHandlers = useChangeInputType('date')
    const timeHandlers = useChangeInputType('time')

    const [places, setPlaces] = useState(/***@type{PlaceType[]}*/[])

    function handleSave() {

    }

    return (
        <div className='wrapper'>
            <Container className='column gap-1 pb-20'>
                <PageHeader arrowBack title='Добавить локацию'/>
                <div className='column gap-0.25'>
                    <InputWithSuggests
                        type='text'
                        placeholder='Выберите место'
                        onPlaces={setPlaces}
                    />
                    <div className='flex-stretch'>
                        <Input
                            className='br-right-0'
                            type='text'
                            placeholder='Дата'
                            {...dateHandlers}
                        />
                        <Input
                            className='br-left-0'
                            type='text'
                            placeholder='Время'
                            {...timeHandlers}
                        />
                    </div>
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
                            key={p.formatted_address}
                            title={p.name}
                            imgURLs={p.photos || [DEFAULT_IMG_URL]}
                            entityType={p.formatted_address}
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
