import React, {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";

import {defaultMovementTags, MS_IN_DAY} from "../../../../static/constants";
import ToggleBox from "../../../../components/ui/ToggleBox/ToggleBox";
import {TextArea} from "../../../../components/ui/TextArea/TextArea";
import DateRange from "../../../../components/DateRange/DateRange";
import Container from "../../../../components/Container/Container";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import useTravelContext from "../../../../hooks/useTravelContext";
import useUserSelector from "../../../../hooks/useUserSelector";
import Button from "../../../../components/ui/Button/Button";

import "./TravelEdit.css"


/**
 * Компонент редактирования параметров путешествия
 * @function
 * @name TravelEdit
 * @category Pages
 */
export default function TravelEdit() {
    const navigate = useNavigate()

    const user = useUserSelector()
    const {travel,travelObj} = useTravelContext()
    /*** название путешествия */
    const [title, setTitle] = useState('')
    /*** диапазон дат путешествия */
    const [range, setRange] = useState(/***@type{DateRangeType | null}*/null)
    /*** ограничение диапазона дат путешествия (не раньше текущей даты) */
    const minDateValue = useMemo(() => new Date().toISOString(), [])
    const [daysInputValue, setDaysInputValue] = useState('')
    /*** количество дней в поездке */
    const [daysCount, setDaysCount] = useState(1)
    /*** описание путешествия */
    const [description, setDescription] = useState('')
    /*** способы передвижения */
    const [tags, setTags] = useState(/**@type{MovementType[]}*/[])
    const [isPublic, setIsPublic] = useState(false)
    const [changed, setChanged] = useState(false)

    // const currentDay = new Date().toISOString().split('T').shift()

    /*** обновление состояния компонента (заполнение уже существующих полей путешествия) */
    useEffect(() => {
        setTitle(travelObj.title)
        setRange({
            start: travelObj.date_start.toISOString(),
            end: travelObj.date_end.toISOString() || travelObj.date_start.toISOString()
        })
        setDescription(travelObj.description)
        /**@type{MovementType[]}*/
        const t = defaultMovementTags
            .filter(mt => !!~travelObj.movementTypes.findIndex(item => item.id === mt.id))
        setTags(t)

        const start = new Date(travelObj.date_start)
        const end = new Date(travelObj.date_end)
        if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
            const ms = end - start
            if (ms > MS_IN_DAY) {
                const days = Math.ceil(ms / MS_IN_DAY)
                setDaysCount(days || 1)
            }
        } else setDaysCount(undefined)
        setIsPublic(travelObj.isPublic === 1)
        //... доьавить остальные поля в будущем
    }, [])

    function handleSave() {
        // Здечь должна быть обработка сохранения изменений
        if (hasChanges()) {
            const newTags = tags.map(({id,title}) => ({id, title}))
            travel
                .setTitle(title)
                .setDateStart(range.start)
                .setDateEnd(range.end)
                .setDescription(description)
                .setMovementTypes(newTags)
                .setIsPublic(isPublic ? 1 : 0)
                .routeBuilder.updateRoute()

            travel
                .save(user.id)
                .then(() => navigate(`/travel/${travelObj.id}/1/`))
        }
    }

    function hasChanges(){
        return changed
    }

    /***
     * обработчик нажатия на способ перемещения
     * @param {MovementType} tag
     */
    function handleTagClick(tag) {
        const newTagList = tags.includes(tag)
            ? tags.filter(t => t !== tag)
            : [...tags, tag]
        setTags(newTagList)
        setChanged(true)
    }

    /***
     * измененный диапазрн дат (начало - конец)
     * @param {string} start
     * @param {string} end
     */
    function handleDateRangeChange({start, end}) {
        /***@type{DateRangeType}*/
        const newRange = {...range}
        if (start) newRange.start = start
        if (end) newRange.end = end
        setRange(newRange)
        setChanged(true)
    }

    /***
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e
     */
    function handleTravelDays(e) {
        const val = /[0-9]+/.exec(e.target.value)
        if (val && val[0]) {
            const days = parseInt(val[0])
            if (!Number.isNaN(days) && days > 0) {
                updateDateRange(range, days)
            } else {
                updateDateRange(range, 0)
            }
        } else {
            setDaysCount(undefined)
        }
        setDaysInputValue(e.target.value)
        if(travelObj.days !== +e.target.value) setChanged(true)
    }

    /***
     * @param {DateRangeType} range
     * @param {number} days
     */
    function updateDateRange(range, days) {
        if (typeof days === "number" && days > 0) {
            setDaysCount(days)
            if ((range.start && !range.end) || (range.start && range.end)) {
                const tempTime = new Date(range.start).getTime() + MS_IN_DAY * days
                setRange({...range, end: new Date(tempTime).toISOString()})
            } else if (!range.start && range.end) {
                const tempTime = new Date(range.end).getTime() - MS_IN_DAY * days
                setRange({...range, start: new Date(tempTime).toISOString()})
            }
        }
        setChanged(true)
    }

    function handleToggleBoxChanged(){
        setIsPublic(!isPublic)
        setChanged(true)
    }

    /**@param {InputEvent} e*/
    function handleTitleChange(e){
        setTitle(e.target.value)
        if(e.target.value && e.target.value !== travel.title) setChanged(true)
    }


    return (
        <div className='wrapper'>
            <Container>
                <PageHeader arrowBack title={'Параметры'}/>
            </Container>
            {
                travelObj && (
                    <Container className='content'>
                        <div className='block column gap-0.5'>
                            <div className='title-bold'>Название</div>
                            <Input
                                type='text'
                                placeholder={'Название поездки'}
                                value={title}
                                onChange={handleTitleChange}
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
                                    value={daysInputValue || daysCount?.toString()}
                                    onChange={handleTravelDays}
                                    size={1}
                                />
                            </div>
                            {
                                range && (
                                    <DateRange
                                        init={range}
                                        daysCount={daysCount}
                                        minDateValue={minDateValue}
                                        onChange={handleDateRangeChange}
                                    />
                                )
                            }
                        </div>
                        <div className='block column gap-0.5'>
                            <div className='title-bold'>Предпочтительный способ передвижения</div>
                            <div className='flex-wrap gap-1'>
                                {
                                    defaultMovementTags.map(t => (
                                        <Chip
                                            key={t.id}
                                            icon={t.icon}
                                            color={~tags.findIndex(tag => tag.id === t.id) ? 'orange' : 'grey'}
                                            rounded
                                            onClick={() => handleTagClick(t)}
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
                            init={travelObj.isPublic === 1}
                            onChange={handleToggleBoxChanged}
                            title={"Сделать видимым для всех"}
                        />
                    </Container>
                )
            }
            <div className='footer-btn-container footer'>
                <Button
                    onClick={handleSave}
                    disabled={!hasChanges()}
                >
                    Сохранить
                </Button>
            </div>
        </div>
    )
}
