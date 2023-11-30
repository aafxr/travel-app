import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import {defaultMovementTags} from "../../../../static/constants";
import FlatButton from "../../../../components/FlatButton/FlatButton";
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

/**
 * Страница формирования путешествия ( добавление даты / отели / встречи / участники)
 * @function
 * @name TravelSettings
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelSettings() {
    const navigate = useNavigate()
    const {user} = useUserSelector()
    const {travel, update} = useTravelContext()

    const [adultCount, setAdultCount] = useState(1)
    const [childCount, setChildCount] = useState(0)
    const [movement, setMovement] = useState(/**@type{MovementType[]}*/[])
    /*** диапазон дат путешествия */
    const [range, setRange] = useState(/***@type{DateRangeType | null}*/null)

    useEffect(() => {
        setAdultCount(travel.adults_count)
        setChildCount(travel.childs_count)
        const tags = defaultMovementTags
            .filter(item => !!~travel.movementTypes.findIndex(m => m.id === item.id))
        setMovement(tags)
        setRange({
            start: travel.date_start,
            end: travel.date_end
        })
    }, [travel])

    /**
     * обработка нажатия на карточку пользователя
     * @param {UserAppType} user
     */
    function handleUserClick(user) {
        if (user) {
            navigate(`/travel/${travel.id}/settings/${user.id}/`)
        }
    }

    // travel members change handlers ==================================================================================
    /** обновление предпологаемого числа взрослых в путешествии
     * @param {number} num
     */
    function handleAdultChange(num) {
        setAdultCount(num)
        travel.setAdultsCount(num)
    }

    /** обновление предпологаемого числа детей в путешествии
     * @param {number} num
     */
    function handleTeenagerChange(num) {
        setChildCount(num)
        travel.setChildsCount(num)
    }

    // travel members change handlers ==================================================================================
    /**
     * добавление / удаление способа перемещения во время маршрута
     * @param {MovementType} movementType
     */
    function handleMovementSelect(movementType) {
        const newTagList = ~movement.findIndex(mt => mt.id === movementType.id)
            ? movement.filter(t => t.id !== movementType.id)
            : [...movement, movementType]
        console.log(newTagList)
        setMovement(newTagList)
        travel.setMovementTypes(newTagList)
    }

    function hasChanges() {
        return travel.change
    }

    //==================================================================================================================
    /**
     * обработчик изменения времени
     * @param {string} start
     * @param {string} end
     */
    // function handleDateRangeChange({start, end}) {
    //     setRange({start, end})
    //     if (start) travel.date_start = start
    //     if (end) travel.date_end = end
    // }

    //==================================================================================================================
    /** сохранение параметров путешествия */
    function handleSaveTravelButton() {
        if (!travel) {
            pushAlertMessage({type: 'warning', message: 'Не удалость получить информацию о путешествии'})
            return
        } else if (!travel.date_start) {
            pushAlertMessage({type: 'warning', message: 'Укажите дату начала путешествия'})
            return
        } else if (!travel.date_end) {
            pushAlertMessage({type: 'warning', message: 'Укажите дату конца путешествия'})
            return
        } else if (!travel.movementTypes.length) {
            pushAlertMessage({type: 'warning', message: 'Укажите способ перемещения'})
            return
        } else if (!travel.date_end) {
            pushAlertMessage({type: 'warning', message: 'Укажите дату конца путешествия'})
            return
        } else if (!travel.adults_count && !!travel.childs_count) {
            pushAlertMessage({type: 'warning', message: 'Укажите количество участников путешествия'})
            return
        } else if (!user) {
            pushAlertMessage({type: 'warning', message: 'Авторизуйтесь'})
            return
        }

        travel
            .setAdultsCount(adultCount)
            .setChildsCount(childCount)
            .setDateStart(range.start)
            .setDateEnd(range.end)
            .save(user.id)
            .then(() => update())
            .then(() => navigate(`/travel/${travel.id}/`))
            .catch(err => {
                ErrorReport.sendError(err).catch(console.error)
                pushAlertMessage({type: 'danger', message: 'Произовла ошибка во время записи путешествия в бд'})
            })
    }

    return (
        <>
            <div className='travel-settings wrapper'>
                <Container>
                    <PageHeader arrowBack to={`/travel/${travel.id}/`} title={'Параметры'}/>
                </Container>
                <Container className='content overflow-x-hidden'>
                    {
                        travel
                            ? (
                                <div className='content column'>
                                    {
                                        travel.direction && (
                                            <section className='travel-settings-dirrection block'>
                                                <h4 className='title-semi-bold'>Направление</h4>
                                                <div className='travel-settings-dirrection-title row'>
                                                    <Chip color='light-orange' rounded>
                                                        {travel.direction}
                                                    </Chip>
                                                </div>
                                            </section>
                                        )
                                    }

                                    {/*<section className='travel-settings-date column gap-0.5 block'>*/}
                                    {/*    <h4 className='title-semi-bold'>Дата поездки</h4>*/}
                                    {/*    <DateRange*/}
                                    {/*        init={{start: travel.date_start, end: travel.date_end}}*/}
                                    {/*        minDateValue={travel.date_start || ''}*/}
                                    {/*        onChange={handleDateRangeChange}*/}
                                    {/*    />*/}
                                    {/*</section>*/}

                                    <section className='travel-settings-members column gap-0.5 block'>
                                        <h4 className='title-semi-bold'>Участники</h4>
                                        <TravelPeople peopleList={travel.members} onClick={handleUserClick}/>
                                        <div className='center'>
                                            {/*<AddButton to={`/travel/${travelCode}/settings/invite/`}>Добавить*/}
                                            {/*    участника</AddButton>*/}
                                        </div>
                                        <div className='flex-between'>
                                            <span>Взрослые</span>
                                            <Counter
                                                initialValue={travel.adults_count}
                                                min={travel.members.filter(m => !m.isChild).length || 1}
                                                onChange={handleAdultChange}
                                            />
                                        </div>
                                        <div className='flex-between'>
                                            <span>Дети</span>
                                            <Counter
                                                initialValue={travel.childs_count}
                                                min={travel.members.filter(m => m.isChild).length}
                                                onChange={handleTeenagerChange}
                                            />
                                        </div>
                                    </section>

                                    {
                                        Array.isArray(travel.hotels) && travel.hotels.length > 0 && (
                                            <section className='travel-settings-hotels column gap-0.5 block'>
                                                <h4 className='title-semi-bold'>Отель</h4>
                                                {
                                                    travel.hotels.map(h => (
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
                                        Array.isArray(travel.appointments) && travel.appointments.length > 0 && (
                                            <section className='travel-settings-appointments column gap-0.5 block'>
                                                <h4 className='title-semi-bold'>Встреча</h4>
                                                {
                                                    !!travel.appointments && Array.isArray(travel.appointments) && (
                                                        travel.appointments.map(a => (
                                                            <Link key={a.id} to={`/travel/${travel.id}/add/appointment/${a.id}/`}>
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
                            )
                            : (<div>загрузка информации о путешествии</div>)
                    }
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