import React, {useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import constants, {defaultMovementTags} from "../../../../static/constants";
import {TextArea} from "../../../../components/ui/TextArea/TextArea";
import Container from "../../../../components/Container/Container";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import Button from "../../../../components/ui/Button/Button";
import changedFields from "../../../../utils/changedFields";
import createAction from "../../../../utils/createAction";
import storeDB from "../../../../db/storeDB/storeDB";
import {actions} from "../../../../redux/store";
import DateRange from "../../../../components/DateRange/DateRange";
import useTravel from "../../hooks/useTravel";


export default function TravelEdite() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {travelCode} = useParams()
    const {user} = useSelector(state => state[constants.redux.USER])
    const travel = useTravel()

    const [title, setTitle] = useState('')
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const minDateValue = useMemo(() => new Date().toISOString(), [])
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState([])

    const currentDay = new Date().toISOString().split('T').shift()

    useEffect(() => {
        if (travel) {
            travel.title && setTitle(travel.title)
            travel.date_start && setStart(travel.date_start)
            travel.date_end && setEnd(travel.date_end)
            travel.description && setDescription(travel.description)
            travel.movementTypes && setTags(travel.movementTypes.map(mt => mt.id))
            //... доьавить остальные поля в будущем
        }

    }, [travel])

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
                title,
                date_start: start,
                date_end: end,
                description,
                movementTypes: defaultMovementTags.filter(t => tags.includes(t.id)).map(t => {
                    const _t = {...t}
                    delete _t.icon
                    return _t
                })
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
                storeDB.editElement(constants.store.TRAVEL, newTravelData),
                storeDB.editElement(constants.store.TRAVEL_ACTIONS, action)
            ])
                .then(() => {
                    dispatch(actions.travelActions.updateTravel(newTravelData))
                    navigate(`/travel/${travel.id}/`)
                })
        }
    }

    function handleTagClick(id) {
        const newTagList = tags.includes(id)
            ? tags.filter(t => t !== id)
            : [...tags, id]
        setTags(newTagList)
    }

    function getNewTravelData() {
        return {
            ...travel,
            title, start, end, description, tags
        }
    }

    /**
     * измененный диапазрн дат (начало - конец)
     * @param {string} startDate
     * @param {string} endDate
     */
    function handleDateRangeChange({start: startDate, end: endDate}) {
        startDate && setStart(startDate)
        endDate && setEnd(endDate)
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
                    <DateRange
                        startValue={start}
                        endValue={end}
                        minDateValue={minDateValue}
                        onChange={handleDateRangeChange}
                    />
                </div>
                <div className='block column gap-0.5'>
                    <div className='title-bold'>Способы передвижения</div>
                    <div className='flex-wrap gap-1'>
                        {
                            defaultMovementTags.map(t => (
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
                <Button onClick={handleSave}
                        disabled={!changedFields(travel, getNewTravelData()).length}>Сохранить</Button>
            </div>
        </div>
    )
}
