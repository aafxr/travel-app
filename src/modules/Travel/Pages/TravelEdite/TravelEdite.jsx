import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";

import {TextArea} from "../../../../components/ui/TextArea/TextArea";
import Container from "../../../../components/Container/Container";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import Button from "../../../../components/ui/Button/Button";
import WalkIcon from "../../../../components/svg/WalkIcon";
import CarIcon from "../../../../components/svg/CarIcon";
import BusIcon from "../../../../components/svg/BusIcon";
import constants from "../../../../static/constants";
import RadioButtonGroup from "../../../../components/RadioButtonGroup/RadioButtonGroup";

const defaultTags = [
    {id: 1, icon: <WalkIcon/>, title: 'пешком'},
    {id: 2, icon: <CarIcon/>, title: 'авто'},
    {id: 3, icon: <BusIcon/>, title: 'общественный транспорт'},
]

export default function TravelEdite() {
    const {travelCode} = useParams()
    const {travels} = useSelector(state => state[constants.redux.TRAVEL])
    const [title, setTitle] = useState('')
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState([])

    useEffect(() => {
        if (travels && travels.length) {
            const travel = travels.find(t => t.id === travelCode)
            if (travel) {
                setTitle(travel.title)
                //... доьавить остальные поля в будущем
            }
        }
    }, [])

    function handleSave() {
        // Здечь должна быть обработка сохранения изменений
    }

    function handleTagClick(id) {
        const newTagList = tags.includes(id)
            ? tags.filter(t => t !== id)
            : [...tags, id]
        setTags(newTagList)
    }


    return (
        <div className='wrapper'>
            <Container>
                <PageHeader arrowBack title={'Параметры'}/>
            </Container>
            <Container className='content'>
                <div className='block column gap-0.5'>
                    <div className='title-bold'>Название</div>
                    <Input
                        type='text'
                        placeholder={'Название поездки'}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>
                <div className='block column gap-0.5'>
                    <div className='title-bold'>Дата поездки</div>
                    <div className='flex-stretch gap-0.25'>
                        <Input
                            type='date'
                            placeholder={'Начало'}
                            value={start}
                            onChange={e => setStart(e.target.value)}
                            // onFocus={e => e.target.type = 'date'}
                            // onBlur={e => e.target.type = 'text'}
                        />
                        <Input
                            type='date'
                            placeholder={'Завершение'}
                            value={end}
                            onChange={e => setEnd(e.target.value)}
                            // onFocus={e => e.target.type = 'date'}
                            // onBlur={e => e.target.type = 'text'}
                        />
                    </div>
                </div>
                <div className='block column gap-0.5'>
                    <div className='title-bold'>Способы передвижения</div>
                    <div className='flex-wrap gap-1'>
                        {
                            defaultTags.map(t => (
                                <Chip
                                    key={t.id}
                                    icon={t.icon}
                                    color={tags.includes(t.id) ? 'orange' : 'grey'}
                                    rounded
                                    onClick={() => handleTagClick(t.id)}
                                >
                                    {t.title}
                                </Chip>
                            ))
                        }
                    </div>
                </div>
                <div className='block column gap-0.5'>
                    <div className='title-bold'>Описание</div>
                    <TextArea value={description} onChange={e => setDescription(e.target.value)}
                              placeholder='Описание'/>
                </div>
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave}>Сохранить</Button>
            </div>
        </div>
    )
}
