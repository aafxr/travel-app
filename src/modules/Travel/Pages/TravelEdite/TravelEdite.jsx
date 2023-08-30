import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {TextArea} from "../../../../components/ui/TextArea/TextArea";
import Container from "../../../../components/Container/Container";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import Button from "../../../../components/ui/Button/Button";
import WalkIcon from "../../../../components/svg/WalkIcon";
import CarIcon from "../../../../components/svg/CarIcon";
import BusIcon from "../../../../components/svg/BusIcon";
import constants from "../../../../static/constants";
import changedFields from "../../../../utils/changedFields";
import createAction from "../../../../utils/createAction";
import travelDB from "../../../../db/travelDB/travelDB";
import {actions} from "../../../../redux/store";

const defaultTags = [
    {id: 1, icon: <WalkIcon className='img-abs' />, title: 'пешком'},
    {id: 2, icon: <CarIcon className='img-abs'/>, title: 'авто'},
    {id: 3, icon: <BusIcon className='img-abs'/>, title: 'общественный транспорт'},
]

export default function TravelEdite() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {travelCode} = useParams()
    const {travels} = useSelector(state => state[constants.redux.TRAVEL])
    const {user} = useSelector(state => state[constants.redux.USER])
    const [travel, setTravel] = useState('')

    const [title, setTitle] = useState('')
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState([])

    const currentDay = new Date().toISOString().split('T').shift()

    useEffect(() => {
        if (travels && travels.length) {
            const travelData = travels.find(t => t.id === travelCode)
            if (travelData) {
                setTravel(travelData)

                travelData.title && setTitle(travelData.title)
                travelData.start && setStart(travelData.start)
                travelData.end && setEnd(travelData.end)
                travelData.description && setDescription(travelData.description)
                travelData.tags && setTags(travelData.tags)
                //... доьавить остальные поля в будущем
            }
        }
    }, [])

    function handleSave() {
        // Здечь должна быть обработка сохранения изменений
        if (
            title !== travel.title
            || start !== travel.start
            || end !== travel.end
            || description !== travel.description
            || tags !== travel.tags
        ) {
            const newTravelData = {
                ...travel,
                title, start, end, description, tags
            }
            //измененные поля
            const changedFieldsList = changedFields(travel, newTravelData)
            !changedFieldsList.includes('id') && changedFieldsList.push('id')
            //объект с измененными данными
            const result = changedFieldsList.reduce((acc, key) => {
                acc[key] = newTravelData[key]
                return acc
            }, {})

            //создаем  action и пишем в ДБ
            const action = createAction(constants.store.TRAVEL, user.id, 'update', result)
            Promise.all([
                travelDB.editElement(constants.store.TRAVEL, newTravelData),
                travelDB.editElement(constants.store.TRAVEL_ACTIONS, action)
            ])
                .then(() => {
                    dispatch(actions.travelActions.updateTravels(newTravelData))
                    navigate(-1)
                })
        }
    }

    function handleTagClick(id) {
        const newTagList = tags.includes(id)
            ? tags.filter(t => t !== id)
            : [...tags, id]
        setTags(newTagList)
    }

    function getNewTravelData(){
        return {
        ...travel,
            title, start, end, description, tags
        }
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
                            min={currentDay}
                            onChange={e => setStart(e.target.value)}
                            // onFocus={e => e.target.type = 'date'}
                            // onBlur={e => e.target.type = 'text'}
                        />
                        <Input
                            type='date'
                            placeholder={'Завершение'}
                            value={end}
                            min={start || currentDay}
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
                <Button onClick={handleSave} disabled={!changedFields(travel, getNewTravelData()).length} >Сохранить</Button>
            </div>
        </div>
    )
}
