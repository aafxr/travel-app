import React, {useState} from "react";

import Container from "../../../../components/Container/Container";
import useTravelContext from "../../../../hooks/useTravelContext";
import {Chip, Input, PageHeader} from "../../../../components/ui";
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
    const {travel} = useTravelContext()
    const [title, setTitle] = useState('')
    const dateHandlers = useChangeInputType('date')
    const timeHandlers = useChangeInputType('time')


    function handleSave() {
    }

    return (
        <div className='wrapper'>
            <Container className='column gap-1 pb-20'>
                <PageHeader arrowBack title='Добавить локацию'/>
                <div className='column gap-0.25'>
                    <Input
                        type='text'
                        value={title}
                        onChange={(e)=> setTitle(e.target.value) }
                        placeholder='Выберите место'
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
                {/*{*/}
                {/*    Array.isArray(places) && places.map(p => (*/}

                {/*        <LocationCard*/}
                {/*            key={p.id}*/}
                {/*            title={p.name}*/}
                {/*            imgURLs={p.photos || [DEFAULT_IMG_URL]}*/}
                {/*            entityType={p.formatted_address}*/}
                {/*            // onAdd={}*/}
                {/*        />*/}
                {/*    ))*/}
                {/*}*/}
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave}>Добавить</Button>
            </div>
        </div>
    )
}
