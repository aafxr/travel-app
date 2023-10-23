import React, {useState} from "react";
import {useParams} from "react-router-dom";

import LocationCard from "../../components/LocationCard/LocationCard";
import Container from "../../../../components/Container/Container";
import {Chip, Input, InputWithSuggests, PageHeader} from "../../../../components/ui";
import useChangeInputType from "../../hooks/useChangeInputType";
import Button from "../../../../components/ui/Button/Button";

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

    const [places, setPlaces] = useState(/***@type{PlaceType}*/[])

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
                <div className='row gap-1'>
                    <Chip rounded color='grey'>Архитектура</Chip>
                    <Chip rounded color='grey'>Парки</Chip>
                    <Chip rounded color='grey'>Экскурсии</Chip>
                    <Chip rounded color='grey'>Прокат</Chip>
                </div>
            </Container>
            <Container className='content column gap-1'>
                {
                    Array.isArray(places) && places.map(p => (
                        <LocationCard
                            key={p.formatted_address}
                            title={p.name}
                            imgURLs={p.photos || []}
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
