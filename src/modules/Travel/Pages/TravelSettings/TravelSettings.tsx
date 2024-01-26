import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import TravelPeople from "../../components/TravelPeople/TravelPeople";
import Container from "../../../../components/Container/Container";
import DateRange from "../../../../components/DateRange/DateRange";
import useTravelContext from "../../../../hooks/useTravelContext";
import useUserSelector from "../../../../hooks/useUserSelector";
import ErrorReport from "../../../../controllers/ErrorReport";
import Counter from "../../../../components/Counter/Counter";
import Button from "../../../../components/ui/Button/Button";
import {Chip, PageHeader} from "../../../../components/ui";
import dateRange from "../../../../utils/dateRange";

import './TravelSettings.css'
import RadioButtonGroup from "../../../../components/RadioButtonGroup/RadioButtonGroup";
import {defaultMovementTags} from "../../../../components/defaultMovementTags";
import {useAppContext, useTravel, useUser} from "../../../../contexts/AppContextProvider";
import {Member} from "../../../../classes/StoreEntities/Member";
import {MovementType} from "../../../../types/MovementType";
import {TravelService} from "../../../../classes/services";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {Travel} from "../../../../classes/StoreEntities";


const sightseeingTime = [
    {id: 1, title: 'Низкая'},
    {id: 2, title: 'Средняя'},
    {id: 3, title: 'Высокая'},
]

const depth = [
    {id: 1, title: 'Поверхностно'},
    {id: 2, title: 'Обычно'},
    {id: 3, title: 'Детально'},
]
/**
 * Страница формирования путешествия ( добавление даты / отели / встречи / участники)
 * @function
 * @name TravelSettings
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelSettings() {
    const [updatedTravel, setUpdatedTravel] = useState<Travel>(new Travel({}))
    const [hasChange, setHasChange] = useState(false)

    const user = useUser()!
    const travel = useTravel()!
    const context = useAppContext()
    const navigate = useNavigate()

    useEffect(() => {
        if (!travel.permitChange(user)) navigate(`/travel/${travel.id}/1/`)
        const updTravel = new Travel(travel)
        const unsub = updTravel.subscribe('update', () => hasChange ? null : setHasChange(true))
        setUpdatedTravel(updTravel)
        return () => unsub()
    }, [])


    /** обработка нажатия на карточку пользователя */
    const handleUserClick = (user: Member) => navigate(`/travel/${travel.id}/settings/${user.id}/`)


    /** добавление / удаление способа перемещения во время маршрута */
    function handleMovementSelect(movementType: MovementType) {
        if (updatedTravel.movementTypes.length === 1 && movementType === updatedTravel.movementTypes[0]) return
        if (updatedTravel.movementTypes.includes(movementType))
            updatedTravel.setMovementTypes(updatedTravel.movementTypes.filter(mt => mt !== movementType))
        else
            updatedTravel.setMovementTypes([...updatedTravel.movementTypes, movementType])
    }


    /** обработчик изменения времени */
    function handleDateRangeChange({start, end}: { start?: Date, end?: Date }) {
        if (start) updatedTravel.setDate_start(start)
        if (end) updatedTravel.setDate_end(end)
    }

    //==================================================================================================================
    /** сохранение параметров путешествия */
    function handleSaveTravelButton() {
        TravelService.update(context, updatedTravel)
            .then(() => context.setTravel(updatedTravel))
            .catch(defaultHandleError)
    }


    return (
        <>
            <div className='travel-settings wrapper'>
                <Container>
                    <PageHeader arrowBack to={`/travel/${travel.id}/`} title={'Параметры'}/>
                </Container>
                <Container className='content overflow-x-hidden'>
                    <div className='content column'>
                        {
                            updatedTravel.direction && (
                                <section className='travel-settings-dirrection block'>
                                    <h4 className='title-semi-bold'>Направление</h4>
                                    <div className='travel-settings-dirrection-title row'>
                                        <Chip color='light-orange' rounded>
                                            {updatedTravel.direction}
                                        </Chip>
                                    </div>
                                </section>
                            )
                        }

                        <section className='travel-settings-date column gap-0.5 block'>
                            <h4 className='title-semi-bold'>Дата поездки</h4>
                            <DateRange
                                init={{
                                    start: updatedTravel.date_start,
                                    end: updatedTravel.date_end
                                }}
                                minDate={updatedTravel.date_start}
                                onChange={handleDateRangeChange}
                            />
                        </section>

                        <section className='travel-settings-members column gap-0.5 block'>
                            <h4 className='title-semi-bold'>Участники</h4>
                            <TravelPeople peopleList={updatedTravel.members} onClick={handleUserClick}/>
                            <div className='center'>
                                {/*<AddButton to={`/travel/${travelCode}/settings/invite/`}>Добавить*/}
                                {/*    участника</AddButton>*/}
                            </div>
                            <div className='flex-between'>
                                <span>Взрослые</span>
                                <Counter
                                    initialValue={updatedTravel.members_count}
                                    min={updatedTravel.members.filter(m => !m.isChild).length || 1}
                                    onChange={handleAdultChange}
                                />
                            </div>
                            <div className='flex-between'>
                                <span>Дети</span>
                                <Counter
                                    initialValue={updatedTravel.children_count}
                                    min={updatedTravel.members.filter(m => m.isChild).length}
                                    onChange={handleTeenagerChange}
                                />
                            </div>
                        </section>

                        <section className='block'>
                            <RadioButtonGroup
                                title={'Насыщенность путешествия'}
                                checklist={sightseeingTime}
                                onChange={console.log}
                                initValue={sightseeingTime[1]}
                            />
                        </section>

                        <section className='block'>
                            <RadioButtonGroup
                                title={'Глубина осмотра '}
                                checklist={depth}
                                onChange={console.log}
                                initValue={depth[1]}
                            />
                        </section>

                        {
                            Array.isArray(updatedTravel.hotels) && updatedTravel.hotels.length > 0 && (
                                <section className='travel-settings-hotels column gap-0.5 block'>
                                    <h4 className='title-semi-bold'>Отель</h4>
                                    {
                                        updatedTravel.hotels.map(h => (
                                            <Link key={h.id} to={`/travel/${travel.id}/add/hotel/${h.id}/`}>
                                                <div className='travel-settings-hotel'>
                                                    <div
                                                        className='travel-settings-hotel-rent'>{dateRange(h.check_in, h.check_out)}</div>
                                                    <div
                                                        className='travel-settings-hotel-title title-semi-bold'>{h.title}</div>
                                                </div>
                                            </Link>
                                        ))
                                    }
                                    {/*<div*/}
                                    {/*    className='link'*/}
                                    {/*    onClick={() => navigate(`/travel/${travelCode}/add/hotel/`)}*/}
                                    {/*>*/}
                                    {/*    + Добавить отель*/}
                                    {/*</div>*/}
                                </section>
                            )
                        }

                        {
                            Array.isArray(updatedTravel.appointments) && updatedTravel.appointments.length > 0 && (
                                <section className='travel-settings-appointments column gap-0.5 block'>
                                    <h4 className='title-semi-bold'>Встреча</h4>
                                    {
                                        !!updatedTravel.appointments && Array.isArray(updatedTravel.appointments) && (
                                            updatedTravel.appointments.map(a => (
                                                <Link key={a.id}
                                                      to={`/travel/${travel.id}/add/appointment/${a.id}/`}>
                                                    <div className='travel-settings-appointment'>
                                                        <div
                                                            className='travel-settings-appointment-date'>{dateRange(a.date, a.date) + ' ' + a.time.split(':').slice(0, 2).join(':')}</div>
                                                        <div
                                                            className='travel-settings-appointment-title title-semi-bold'>{a.title}</div>
                                                    </div>
                                                </Link>
                                            ))
                                        )
                                    }
                                    {/*<div*/}
                                    {/*    className='link'*/}
                                    {/*    onClick={() => navigate(`/travel/${travelCode}/add/appointment/`)}*/}
                                    {/*>*/}
                                    {/*    + Добавить встречу*/}
                                    {/*</div>*/}
                                </section>
                            )
                        }

                        {/*<section className='travel-settings-movement column gap-0.5 block'>*/}
                        {/*    <h4 className='title-semi-bold'>Предпочитаемый способ передвижения</h4>*/}
                        {/*    <div className='flex-wrap gap-1'>*/}
                        {/*        {*/}
                        {/*            defaultMovementTags.map(dmt => (*/}
                        {/*                <Chip*/}
                        {/*                    key={dmt.id}*/}
                        {/*                    icon={dmt.icon}*/}
                        {/*                    color={~movement.findIndex(mt => mt.id === dmt.id) ? 'orange' : 'grey'}*/}
                        {/*                    rounded*/}
                        {/*                    onClick={() => handleMovementSelect(dmt)}*/}
                        {/*                >*/}
                        {/*                    {dmt.title}*/}
                        {/*                </Chip>*/}
                        {/*            ))*/}
                        {/*        }*/}
                        {/*    </div>*/}
                        {/*</section>*/}
                    </div>
                </Container>
                <div className='footer-btn-container footer'>
                    <Button onClick={handleSaveTravelButton} disabled={!hasChanges()}>Построить маршрут</Button>
                </div>
            </div>
            {/*<FlatButton*/}
            {/*    className={'buttons-block'}*/}
            {/*    onInvite={() => navigate(`/travel/${travel.id}/settings/invite/`)}*/}
            {/*    onHotel={() => navigate(`/travel/${travel.id}/add/hotel/`)}*/}
            {/*    onAppointment={() => navigate(`/travel/${travel.id}/add/appointment/`)}*/}
            {/*/>*/}
        </>
    )
}