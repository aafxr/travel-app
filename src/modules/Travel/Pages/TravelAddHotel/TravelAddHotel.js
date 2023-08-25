import React from "react";
import {useParams} from "react-router-dom";

import Button from "../../../../components/ui/Button/Button";
import Container from "../../../../components/Container/Container";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import LocationCard from "../../components/LocationCard/LocationCard";
import {DEFAULT_IMG_URL} from "../../../../static/constants";

export default function TravelAddHotel() {
    const {travelCode} = useParams()

    function handleSave() {

    }

    return (
        <div className='wrapper'>
            <Container className='column gap-1 pb-20'>
                <PageHeader arrowBack title='Добавить отель'/>
                <div className='column gap-0.25'>
                    <Input type='text' placeholder='Откуда'/>
                    <div className='flex-stretch'>
                        <Input className='br-right-0' type='date' placeholder='Дата'/>
                        <Input className='br-left-0' type='time' placeholder='Время'/>
                    </div>
                </div>
                <div className='row gap-1'>
                    <Chip rounded color='grey'>Отель</Chip>
                    <Chip rounded color='grey'>Дом</Chip>
                    <Chip rounded color='grey'>Хостел</Chip>
                    <Chip rounded color='grey'>Квартира</Chip>
                    <Chip rounded color='grey'>Комната</Chip>
                </div>
            </Container>
            <Container className='content column gap-1'>
                <LocationCard title='Cosmos Sochi Hotel' imgURL={DEFAULT_IMG_URL} entityType={'отель'} />
                <LocationCard title='Cosmos Sochi Hotel' imgURL={DEFAULT_IMG_URL} entityType={'отель'} />
                <LocationCard title='Cosmos Sochi Hotel' imgURL={DEFAULT_IMG_URL} entityType={'отель'} />
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave}>Добавить</Button>
            </div>
        </div>
    )
}
