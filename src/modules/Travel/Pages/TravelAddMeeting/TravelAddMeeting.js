import React, {useState} from "react";
import {useParams} from "react-router-dom";

import Button from "../../../../components/ui/Button/Button";
import Container from "../../../../components/Container/Container";
import {Input, PageHeader} from "../../../../components/ui";
import {TextArea} from "../../../../components/ui/TextArea/TextArea";

export default function TravelAddMeeting() {
    const {travelCode} = useParams()
    const [textarea, setTextarea] = useState('')

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
                        <Input
                            className='br-right-0'
                            type='text'
                            placeholder='Дата'
                            onFocus={e => e.target.type = 'date'}
                            onBlure={e => e.target.type = 'text'}
                        />
                        <Input
                            className='br-left-0'
                            type='text'
                            placeholder='Время'
                            onFocus={e => e.target.type = 'time'}
                            onBlure={e => e.target.type = 'text'}
                        />
                    </div>
                </div>
                <div>
                    <div>Комментарий</div>
                    <TextArea
                        placeholder='Например, совещание'
                        value={textarea}
                        onChange={e => setTextarea(e.target.value)}
                    />
                </div>
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave}>Добавить</Button>
            </div>
        </div>
    )
}
