import React from "react";
import {useParams} from "react-router-dom";

import Button from "../../../../components/ui/Button/Button";
import Container from "../../../../components/Container/Container";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import {TextArea} from "../../../../components/ui/TextArea/TextArea";

export default function TravelAddMeeting() {
    const {travelCode} = useParams()

    function handleSave() {

    }

    return (
        <div className='wrapper'>
            <Container>
                <PageHeader arrowBack title='Добавить встречу'/>
            </Container>
            <Container className='content column gap-1'>
                <div className='column gap-0.25'>
                    <Input type='text' placeholder='Укажите место'/>
                    <div className='flex-stretch'>
                        <Input className='br-right-0' type='date' placeholder='Дата'/>
                        <Input className='br-left-0' type='time' placeholder='Время'/>
                    </div>
                </div>
                <div>
                    <div>Комментарий</div>
                    <TextArea placeholder='Например, совещание'/>
                </div>
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave}>Добавить</Button>
            </div>
        </div>
    )
}
