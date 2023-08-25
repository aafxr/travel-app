import React from "react";
import {useParams} from "react-router-dom";

import Button from "../../../../components/ui/Button/Button";
import Container from "../../../../components/Container/Container";
import {Chip, PageHeader} from "../../../../components/ui";
import LocationCard from "../../components/LocationCard/LocationCard";
import {DEFAULT_IMG_URL} from "../../../../static/constants";

export default function TravelOnRoute() {
    const {travelCode} = useParams()

    function handleAdd(){

    }

    function handleSave() {

    }

    return (
        <div className='wrapper'>
            <Container className='column gap-1 pb-20'>
                <PageHeader arrowBack title='По пути'/>
                <div className='row gap-1'>
                    <Chip rounded color='grey'>Рестораны</Chip>
                    <Chip rounded color='grey'>Парки</Chip>
                    <Chip rounded color='grey'>Экскурсии</Chip>
                    <Chip rounded color='grey'>Прокат</Chip>
                    <Chip rounded color='grey'>Музеи</Chip>
                </div>
            </Container>
            <Container className='content column gap-1'>
                <LocationCard title='Cosmos Sochi Hotel' imgURL={DEFAULT_IMG_URL} entityType={'Ресторан'} onAdd={handleAdd}/>
                <LocationCard title='Cosmos Sochi Hotel' imgURL={DEFAULT_IMG_URL} entityType={'Прокат'} onAdd={handleAdd}/>
                <LocationCard title='Cosmos Sochi Hotel' imgURL={DEFAULT_IMG_URL} entityType={'Парк'} onAdd={handleAdd}/>
                <LocationCard title='Cosmos Sochi Hotel' imgURL={DEFAULT_IMG_URL} entityType={'Музей'} onAdd={handleAdd}/>
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave}>Добавить</Button>
            </div>
        </div>
    )
}
