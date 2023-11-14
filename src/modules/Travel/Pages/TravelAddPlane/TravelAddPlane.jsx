import React from "react";

import Container from "../../../../components/Container/Container";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import useChangeInputType from "../../hooks/useChangeInputType";
import Button from "../../../../components/ui/Button/Button";

/**
 * компонент для добавления саолета
 * @function
 * @name TravelAddPlane
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelAddPlane() {
    const dateHandlers = useChangeInputType('date')
    const timeHandlers = useChangeInputType('time')

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
                <div className='column gap-0.25'>
                    <Input type='text' placeholder='Куда'/>
                    <div className='flex-stretch'>
                        <Input
                            className='br-right-0'
                            type='text'
                            placeholder='Дата'
                            onFocus={e => e.target.type = 'date'}
                            onBlur={e => e.target.type = 'text'}
                        />
                        <Input
                            className='br-left-0'
                            type='text'
                            placeholder='Время'
                            onFocus={e => e.target.type = 'time'}
                            onBlur={e => e.target.type = 'text'}
                        />
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
