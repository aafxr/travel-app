import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import {useAppContext, useTravel} from "../../../../contexts/AppContextProvider";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {defaultMovementTags} from "../../../../components/defaultMovementTags";
import {useCloneStoreEntity} from "../../../../hooks/useCloneStoreEntity";
import NumberInput from "../../../../components/ui/Input/NumberInput";
import ToggleBox from "../../../../components/ui/ToggleBox/ToggleBox";
import TextArea from "../../../../components/ui/TextArea/TextArea";
import DateRange from "../../../../components/DateRange/DateRange";
import Container from "../../../../components/Container/Container";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import Button from "../../../../components/ui/Button/Button";
import {MovementType} from "../../../../types/MovementType";
import {TravelService} from "../../../../classes/services";

import "./TravelEdit.css"


/**
 * Компонент редактирования параметров путешествия
 * @function
 * @name TravelEdit
 * @category Pages
 */
export default function TravelEdit() {
    const navigate = useNavigate()

    const travel = useTravel()!
    const context = useAppContext()
    const {item: updateTravel, change} = useCloneStoreEntity(travel)
    const [days, setDays] = useState(0)

    useEffect(() => {
        if(updateTravel) setDays(updateTravel.days)
    },[updateTravel])


    /** обработчик нажатия на способ перемещения */
    function handleTagClick(mt: MovementType) {
        if (!updateTravel) return
        if (!updateTravel.movementTypes.includes(mt))
            updateTravel.setMovementTypes([...updateTravel.movementTypes, mt])
        else if (updateTravel.movementTypes.length > 1)
            updateTravel.setMovementTypes(updateTravel.movementTypes.filter(m => m !== mt))
    }


    /** измененный диапазрн дат (начало - конец) */
    function handleDateRangeChange({start, end}: { start?: Date, end?: Date }) {
        if (!updateTravel) return
        if (start) updateTravel.setDate_start(start)
        if (end) updateTravel.setDate_end(end)
    }


    function handleDescriptionChange(text: string) {
        if (!updateTravel) return
        updateTravel.setDescription(text)
    }


    function handleToggleBoxChanged(isPublic: boolean) {
        if(!updateTravel) return
        updateTravel.setPublic(isPublic)
    }


    function handleTitleChange(text: string) {
        if(!updateTravel) return
        updateTravel.setTitle(text)
    }


    function handleTravelDays(d:number){
        setDays(d)
        if (updateTravel) updateTravel.setDays(d)
    }


    function handleSave() {
        if (change && updateTravel)
            TravelService.update(context, updateTravel)
                .then(() => navigate(`/travel/${updateTravel.id}/`))
                .then(() => context.setTravel(updateTravel))
                .catch(defaultHandleError)
    }

    if (!updateTravel) return null

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
                        value={updateTravel.title}
                        onChange={handleTitleChange}
                    />
                </div>
                <div className='block column gap-0.5'>
                    <div className='title-bold'>Дата поездки</div>
                    <div className='travel-edit-days'>
                        <div className='title-semi-bold'>Количество дней</div>
                        <NumberInput
                            // className='travel-edit-days-input'
                            value={days}
                            onChange={handleTravelDays}
                            size={1}
                        />
                    </div>
                    <DateRange
                        init={updateTravel.date_start.getTime() > 0 ? {
                            start: updateTravel.date_start,
                            end: updateTravel.date_end
                        } : undefined}
                        minDate={updateTravel.date_start}
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
                                    color={~updateTravel.movementTypes.findIndex(mt => mt === t.id) ? 'orange' : 'grey'}
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
                    <TextArea init={updateTravel.description} onChange={handleDescriptionChange} placeholder='Описание'/>
                </div>
                <ToggleBox
                    className='block'
                    init={travel.isPublic}
                    onChange={handleToggleBoxChanged}
                    title={"Сделать видимым для всех"}
                />
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave} disabled={!change}>
                    Сохранить
                </Button>
            </div>
        </div>
    )
}
