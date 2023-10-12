import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate, useParams} from "react-router-dom";

import constants, {defaultMovementTags} from "../../../../static/constants";
import ButtonsBlock from "../../../../components/ButtonsBlock/ButtonsBlock";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import TravelPeople from "../../components/TravelPeople/TravelPeople";
import Container from "../../../../components/Container/Container";
import DateRange from "../../../../components/DateRange/DateRange";
import ErrorReport from "../../../../controllers/ErrorReport";
import Counter from "../../../../components/Counter/Counter";
import Button from "../../../../components/ui/Button/Button";
import {Chip, PageHeader} from "../../../../components/ui";
import createAction from "../../../../utils/createAction";
import storeDB from "../../../../db/storeDB/storeDB";
import dateRange from "../../../../utils/dateRange";
import {actions} from "../../../../redux/store";
import useTravel from "../../hooks/useTravel";

import './TravelSettings.css'

/**
 * Страница формирования путешествия ( добавление даты / отели / встречи / участники)
 * @function
 * @name TravelSettings
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelSettings() {
    const {travelCode} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector(state => state[constants.redux.USER])
    const {travel, errorMessage} = useTravel()

    /**
     * обработка нажатия на карточку пользователя
     * @param {UserAppType} user
     */
    function handleUserClick(user) {
        if (user) {
            console.log(user)
            navigate(`/travel/${travelCode}/settings/${user.id}/`)
        }
    }

    // travel members change handlers ==================================================================================
    /** обновление предпологаемого числа взрослых в путешествии
     * @param {number} num
     */
    function handleAdultChange(num) {
        if (!travel) return
        dispatch(actions.travelActions.setAdultCount(num))
    }

    /** обновление предпологаемого числа детей в путешествии
     * @param {number} num
     */
    function handleTeenagerChange(num) {
        if (!travel) return
        dispatch(actions.travelActions.setChildCount(num))
    }

    // travel members change handlers ==================================================================================
    /**
     * добавление / удаление способа перемещения во время маршрута
     * @param {MovementType} movementType
     */
    function handleMovementSelect(movementType) {
        if (!travel) return

        const mt = {...movementType}
        delete mt.icon

        if (travel.movementTypes.find(m => m.id === mt.id)) {
            dispatch(actions.travelActions.removeMovementType(mt))
        } else {
            dispatch(actions.travelActions.addMovementType(mt))
        }
    }

    //==================================================================================================================
    /**
     * обработчик изменения времени
     * @param {string} start
     * @param {string} end
     */
    function handleDateRangeChange({start, end}) {
        if (!travel) return
        if (start !== travel.date_start) dispatch(actions.travelActions.setTravelStartDate(start))
        if (end !== travel.date_end) dispatch(actions.travelActions.setTravelEndDate(end))
    }

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

        const action = createAction(constants.store.TRAVEL, user.id, "add", travel)
        Promise.all([
            storeDB.editElement(constants.store.TRAVEL, travel),
            storeDB.addElement(constants.store.TRAVEL_ACTIONS, action)
        ])
            .then(() => navigate(`/travel/${travel.id}/`))
            .catch(err => {
                ErrorReport.sendError(err).catch(console.error)
                pushAlertMessage({type: 'danger', message: 'Произовла ошибка во время записи путешествия в бд'})
            })
    }


    return (
        <div className='travel-settings wrapper'>
            <Container>
                <PageHeader arrowBack to={`/travel/${travelCode}/`} title={'Параметры'}/>
            </Container>
            <Container className='content'>
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

                                <section className='travel-settings-date column gap-0.5 block'>
                                    <h4 className='title-semi-bold'>Дата поездки</h4>
                                    <DateRange
                                        startValue={travel.date_start}
                                        endValue={travel.date_end}
                                        onChange={handleDateRangeChange}
                                    />
                                </section>

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
                                            min={travel.members.filter(m => !m.isChild).length}
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
                                                    <Link key={h.id} to={`/travel/${travelCode}/add/hotel/${h.id}/`}>
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
                                                        <Link key={a.id} to={`/travel/${travelCode}/add/appointment/${a.id}/`}>
                                                            <div className='travel-settings-appointment'>
                                                                <div
                                                                    className='travel-settings-appointment-date'>{dateRange(a.date) + ' ' + a.time.split(':').slice(0, 2).join(':')}</div>
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

                                <section className='travel-settings-movement column gap-0.5 block'>
                                    <h4 className='title-semi-bold'>Способы передвижения</h4>
                                    <div className='flex-wrap gap-1'>
                                        {
                                            defaultMovementTags.map(dmt => (
                                                <Chip
                                                    key={dmt.id}
                                                    icon={dmt.icon}
                                                    color={travel.movementTypes.find(mt => mt.id === dmt.id) ? 'orange' : 'grey'}
                                                    rounded
                                                    onClick={() => handleMovementSelect(dmt)}
                                                >
                                                    {dmt.title}
                                                </Chip>
                                            ))
                                        }
                                    </div>
                                </section>
                            </div>
                        )
                        : (<div>загрузка информации о путешествии</div>)
                }
                <ButtonsBlock
                    className={'buttons-block'}
                    onInvite={() => navigate(`/travel/${travelCode}/settings/invite/`)}
                    onHotel={() => navigate(`/travel/${travelCode}/add/hotel/`)}
                    onAppointment={() => navigate(`/travel/${travelCode}/add/appointment/`)}
                />
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSaveTravelButton}>Построить маршрут</Button>
            </div>
        </div>
    )
}