import React from "react";
import {useNavigate} from "react-router-dom";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {useTravelState, UseTravelStateType} from "../../../../hooks/useTravelState";
import {useAppContext, useTravel, useUser} from "../../../../contexts/AppContextProvider";
import {defaultMovementTags} from "../../../../components/defaultMovementTags";
import NumberInput from "../../../../components/ui/Input/NumberInput";
import TextArea from "../../../../components/ui/TextArea/TextArea";
import DateRange from "../../../../components/DateRange/DateRange";
import Container from "../../../../components/Container/Container";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import Button from "../../../../components/ui/Button/Button";
import {MovementType} from "../../../../types/MovementType";
import {TravelService} from "../../../../classes/services";
import {Travel} from "../../../../classes/StoreEntities";
import {MS_IN_DAY} from "../../../../static/constants";

import "./TravelDescriptionAndDate.css"


/**
 * Компонент редактирования параметров путешествия
 * @function
 * @name TravelDescriptionAndDate
 * @category Pages
 */
export default function TravelDescriptionAndDate() {
    const navigate = useNavigate()

    const travel = useTravel()
    const user = useUser()
    const context = useAppContext()
    const [state, setState] = useTravelState(travel)


    function getNewState(state: UseTravelStateType): UseTravelStateType {
        return {...state, travel: {...state.travel}}
    }


    /** обработчик нажатия на способ перемещения */
    function handleTagClick(mt: MovementType) {
        if (!state) return
        const newState = getNewState(state)
        if (!newState.travel.movementTypes.includes(mt))
            newState.travel.movementTypes = [...newState.travel.movementTypes, mt]
        else if (newState.travel.movementTypes.length > 1)
            newState.travel.movementTypes = newState.travel.movementTypes.filter(m => m !== mt)
        setState(newState)
    }


    /** измененный диапазрн дат (начало - конец) */
    function handleDateRangeChange({start, end}: { start?: Date, end?: Date }) {
        if (!state) return
        const newState = getNewState(state)
        if (start) {
            const date_start = new Date(start)
            newState.travel.date_start = new Date(date_start)
            newState.travel.date_end = new Date(date_start.getTime() + MS_IN_DAY * newState.travel.days)
            newState.travel.date_start = date_start
        }
        if (end) {
            const date_end = new Date(end)
            newState.travel.date_start = new Date(date_end.getTime() - MS_IN_DAY * newState.travel.days)
            newState.travel.date_end = date_end
        }
        setState(newState)
    }


    function handleDescriptionChange(text: string) {
        if (!state) return
        const newState = getNewState(state)
        newState.travel.description = text
        setState(newState)
    }


    function handleTitleChange(text: string) {
        if (!state) return
        const newState = getNewState(state)
        newState.travel.title = text
        setState(newState)
    }


    function handleTravelDays(d: number) {
        if (!state) return
        if (d < 1) return

        const newState = getNewState(state)
        newState.travel.date_end = new Date(newState.travel.date_start.getTime() + MS_IN_DAY * d)
        newState.travel.days = d
        setState(newState)
    }


    function handleSave() {
        if (!user) return
        if (!travel) return
        if (!state) return

        if (state.change) {
            const updatedTravel = new Travel(state.travel)
            TravelService.update(updatedTravel, user)
                .then(() => navigate(`/travel/${updatedTravel.id}/`))
                .then(() => context.setTravel(updatedTravel))
                .catch(defaultHandleError)
        }
    }

    function initDateRange() {
        if (!state) return
        if (state.travel.date_start.getTime() < Date.now() / 2) {
            const start = new Date()
            start.setHours(0, 0, 0, 0)
            const end = new Date(start.getTime() + MS_IN_DAY * state.travel.days)
            return {start, end}
        }
        return {start: state.travel.date_start, end: state.travel.date_end}
    }

    if (!state) return null
    if (!travel) return null

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
                        value={state.travel.title}
                        onChange={handleTitleChange}
                    />
                </div>
                <div className='block column gap-0.5'>
                    <div className='title-bold'>Дата поездки</div>
                    <div className='travel-edit-days'>
                        <span className='title-semi-bold'>Количество дней</span>
                        <NumberInput
                            className='travel-edit-days-input'
                            value={state.travel.days}
                            onChange={handleTravelDays}
                            size={1}
                        />
                    </div>
                    <DateRange
                        init={initDateRange()}
                        minDate={state.travel.date_start}
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
                                    color={~state.travel.movementTypes.findIndex(mt => mt === t.id) ? 'orange' : 'grey'}
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
                    <TextArea init={state.travel.description} onChange={handleDescriptionChange}
                              placeholder='Описание'/>
                </div>
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave} disabled={!state.change}>
                    Сохранить
                </Button>
            </div>
        </div>
    )
}
