import React, {useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import constants, {defaultMovementTags, MS_IN_DAY} from "../../../../static/constants";
import ToggleBox from "../../../../components/ui/ToggleBox/ToggleBox";
import {TextArea} from "../../../../components/ui/TextArea/TextArea";
import DateRange from "../../../../components/DateRange/DateRange";
import Container from "../../../../components/Container/Container";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import Button from "../../../../components/ui/Button/Button";
import changedFields from "../../../../utils/changedFields";
import createAction from "../../../../utils/createAction";
import storeDB from "../../../../db/storeDB/storeDB";
import {actions} from "../../../../redux/store";
import useTravel from "../../hooks/useTravel";

import "./TravelEdit.css"
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";


/**
 * Компонент редактирования параметров путешествия
 * @function
 * @name TravelEdit
 * @category Pages
 */
export default function TravelEdit() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {travelCode} = useParams()
    const {user} = useSelector(state => state[constants.redux.USER])
    const {travel, errorMessage} = useTravel()
    /** название путешествия */
    const [title, setTitle] = useState('')
    /** дата начала путешествия */
    const [start, setStart] = useState('')
    /** дата кончания путешествия */
    const [end, setEnd] = useState('')
    /** ограничение диапазона дат путешествия (не раньше текущей даты) */
    const minDateValue = useMemo(() => new Date().toISOString(), [])
    /** количество дней в поездке */
    const [daysCount, setDaysCount] = useState(1)
    /** описание путешествия */
    const [description, setDescription] = useState('')
    /** способы передвижения */
    const [tags, setTags] = useState([])

    // const currentDay = new Date().toISOString().split('T').shift()

    /** обновление состояния компонента (заполнение уже существующих полей путешествия) */
    useEffect(() => {
        if (travel) {
            travel.title && setTitle(travel.title)
            travel.date_start && setStart(travel.date_start)
            travel.date_end && setEnd(travel.date_end)
            travel.description && setDescription(travel.description)
            travel.movementTypes && setTags(travel.movementTypes.map(mt => mt.id))
            if(travel.date_start && travel.date_end){
                const ms = new Date(travel.date_end) - new Date(travel.date_start)
                const days = Math.ceil(ms / MS_IN_DAY)
                setDaysCount(days)
            } else setDaysCount(1)
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

    /** обработчик нажатия на способ перемещения */
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
        if (startDate && endDate) {
            const ms = new Date(endDate || 0).getTime() - new Date(startDate || 0)
            const d = Math.ceil(ms / MS_IN_DAY)
            updateDateRange(d)
        } else if (daysCount) updateDateRange(daysCount)
    }

    // console.log({s: travel?.date_start, e: travel?.date_end})
    /**
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e
     */
    function handleTravelDays(e) {
        console.log(Math.ceil(+e.target.value) || 0)
        const days = parseInt(e.target.value) || 0
        updateDateRange(days)
        setDaysCount(days)
    }

    /**
     *
     * @param {number} days
     */
    function updateDateRange(days) {
        if (typeof days === "number" && days > 0) {
            setDaysCount(days)
            if ((start && !end) || (start && end)) {
                const tempTime = new Date(start).getTime() + MS_IN_DAY * days
                setEnd(new Date(tempTime).toISOString())
            } else if (!start && end) {
                const tempTime = new Date(end).getTime() - MS_IN_DAY * days
                setStart(new Date(tempTime).toISOString())
            }
        }
    }


    return (
        <div className='wrapper'>
            <Container>
                <PageHeader arrowBack title={'Параметры'}/>
            </Container>
            {
                travel && (
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
                            <div className='travel-edit-days'>
                                <div className='title-semi-bold'>Количество дней</div>
                                <input
                                    className='travel-edit-days-input'
                                    type="text"
                                    inputMode='numeric'
                                    value={daysCount}
                                    onChange={handleTravelDays}
                                    size={1}
                                />
                            </div>
                            <DateRange
                                startValue={start}
                                endValue={end}
                                minDateValue={minDateValue}
                                onChange={handleDateRangeChange}
                            />
                        </div>
                        <div className='block column gap-0.5'>
                            <div className='title-bold'>Предпочтительный способ передвижения</div>
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
                        <ToggleBox
                            className='block'
                            init={travel.isPublic}
                            onChange={val => dispatch(actions.travelActions.setPublic(val))}
                            title={"Сделать видимым для всех"}
                        />
                    </Container>
                )
            }
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave}
                        disabled={!changedFields(travel, getNewTravelData()).length}>Сохранить</Button>
            </div>
        </div>
    )
}
