import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate, useParams} from "react-router-dom";

import constants, {defaultMovementTags} from "../../../../static/constants";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import TravelPeople from "../../components/TravelPeople/TravelPeople";
import Container from "../../../../components/Container/Container";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import Counter from "../../../../components/Counter/Counter";
import Button from "../../../../components/ui/Button/Button";
import createAction from "../../../../utils/createAction";
import storeDB from "../../../../db/storeDB/storeDB";
import dateRange from "../../../../utils/dateRange";
import {actions} from "../../../../redux/store";
import useTravel from "../../hooks/useTravel";

import './TravelSettings.css'
import ErrorReport from "../../../../controllers/ErrorReport";


export default function TravelSettings() {
    const {travelCode} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector(state => state[constants.redux.USER])
    const travel = useTravel()

    // const {travels} = useSelector(store => store[constants.redux.TRAVEL])
    // const [travel, setTravel] = useState(null)

    // /** поиск путешествия соответствующего travelCode */
    // useEffect(() => {
    //     if (travels && travels.length) {
    //         const idx = travels.findIndex(t => t.id === travelCode)
    //         if (~idx) setTravel(travels[idx])
    //         else pushAlertMessage({type: "info", message: 'Не удалось найти детали путешествия'})
    //     }
    // }, [travels])

    // useEffect(() => {
    //     if (travel) dispatch(actions.travelActions.selectTravel(travel.id))
    // }, [travel])

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
    function handleAdultChange(num) {

    }

    function handleTeenagerChange(num) {

    }

    // travel members change handlers ==================================================================================
    function handleMovementSelect(movementType) {
        if (!travel) return

        const mt = {...movementType}
        mt.icon = null

        if (travel.movementTypes.find(m => m.id === mt.id)) {
            dispatch(actions.travelActions.removeMovementType(mt))
        } else {
            dispatch(actions.travelActions.addMovementType(mt))
        }
    }

    //==================================================================================================================
    /**
     * обработчик изменения времени
     * @param {React.ChangeEvent<HTMLInputElement>} e
     * @param {'date_start' | 'date_end'}key
     */
    function handleDateChange(e, key) {
        const selectedDate = new Date(e.target.value)
        let start = travel.date_start
            ? new Date(travel.date_start)
            : undefined
        let end = travel.date_end
            ? new Date(travel.date_end)
            : undefined

        if (key === 'date_start') {
            const delta = start
                ? selectedDate - start
                : undefined

            if (delta && end) {
                const newEnd = new Date(end.getTime() + delta)
                dispatch(actions.travelActions.setTravelEndDate(newEnd.toISOString()))
            }
            dispatch(actions.travelActions.setTravelStartDate(new Date(e.target.value).toISOString()))
        } else if (key === 'date_end') {
            dispatch(actions.travelActions.setTravelEndDate(new Date(e.target.value).toISOString()))
        }
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
                pushAlertMessage({type: 'danger',message: 'Произовла ошибка во время записи путешествия в бд'})
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
                                            <div className='travel-settings-dirrection-title flex-between'>
                                                <Chip color='light-orange' rounded>
                                                    {travel.direction}
                                                </Chip>
                                            </div>
                                        </section>
                                    )
                                }

                                <section className='travel-settings-date column gap-0.5 block'>
                                    <h4 className='title-semi-bold'>Дата поездки</h4>
                                    <div className='flex-stretch'>
                                        <Input
                                            className='br-right-0'
                                            type='date'
                                            value={travel.date_start?.split('T').shift()}
                                            onChange={(e) => handleDateChange(e, 'date_start')}
                                            min={new Date().toISOString()}
                                            placeholder='Дата'
                                        />
                                        <Input
                                            className='br-left-0'
                                            type='date'
                                            value={travel.date_end?.split('T').shift()}
                                            onChange={(e) => handleDateChange(e, 'date_end')}
                                            min={travel.date_start || ''}
                                            placeholder='Дата'
                                        />
                                    </div>
                                </section>

                                <section className='travel-settings-members column gap-0.5 block'>
                                    <h4 className='title-semi-bold'>Участники</h4>
                                    <TravelPeople peopleList={[travel.owner_id]} onClick={handleUserClick}/>
                                    <div className='center'>
                                        <AddButton to={`/travel/${travelCode}/settings/invite/`}>Добавить еще</AddButton>
                                    </div>
                                    <div className='flex-between'>
                                        <span>Взрослые</span>
                                        <Counter initialValue={2} min={2} onChange={handleAdultChange}/>
                                    </div>
                                    <div className='flex-between'>
                                        <span>Дети</span>
                                        <Counter initialValue={0} min={0} onChange={handleTeenagerChange}/>
                                    </div>
                                </section>

                                <section className='travel-settings-hotels column gap-0.5 block'>
                                    <h4 className='title-semi-bold'>Отель</h4>
                                    {
                                        !!travel.hotels && Array.isArray(travel.hotels) && (
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
                                        )
                                    }
                                    <div
                                        className='link'
                                        onClick={() => navigate(`/travel/${travelCode}/add/hotel/`)}
                                    >
                                        + Добавить отель
                                    </div>
                                </section>

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
                                    <div
                                        className='link'
                                        onClick={() => navigate(`/travel/${travelCode}/add/appointment/`)}
                                    >
                                        + Добавить отель
                                    </div>
                                </section>

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

            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSaveTravelButton}>Построить маршрут</Button>
            </div>
        </div>
    )
}