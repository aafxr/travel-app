import React from "react";
import {useParams} from "react-router-dom";

import Button from "../../../../components/ui/Button/Button";
import Container from "../../../../components/Container/Container";
import {Chip, Input, PageHeader} from "../../../../components/ui";

export default function TravelAddPlane() {
    const {travelCode} = useParams()

    function handleSave() {

    }

    return (
        <div className='wrapper'>
            <Container>
                <PageHeader arrowBack title='Добавить самолет'/>
            </Container>
            <Container className='content column gap-1'>
                <div className='flex-wrap gap-1'>
                    <Chip color='grey'>Самолет</Chip>
                </div>
                <div className='column gap-0.25'>
                    <Input type='text' placeholder='Откуда'/>
                    <div className='flex-stretch'>
                        <Input className='br-right-0' type='date' placeholder='Дата'/>
                        <Input className='br-left-0' type='time' placeholder='Время'/>
                    </div>
                </div>
                <div className='column gap-0.25'>
                    <Input type='text' placeholder='Куда'/>
                    <div className='flex-stretch'>
                        <Input className='br-right-0' type='date' placeholder='Дата'/>
                        <Input className='br-left-0' type='time' placeholder='Время'/>
                    </div>
                </div>
                {/*<div className='link'>+ Перресадка</div>*/}
                {/*<div className='link'>+ Обратно</div>*/}
            </Container>

            <div className='footer-btn-container footer'>
                <Button onClick={handleSave}>Добавить</Button>
            </div>
        </div>
    )
}
