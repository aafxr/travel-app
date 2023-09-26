import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {Link, useNavigate, useParams} from "react-router-dom";

import AddButton from "../../../../components/ui/AddButtom/AddButton";
import TravelPeople from "../../components/TravelPeople/TravelPeople";
import Container from "../../../../components/Container/Container";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import Counter from "../../../../components/Counter/Counter";
import Button from "../../../../components/ui/Button/Button";
import WalkIcon from "../../../../components/svg/WalkIcon";
import CarIcon from "../../../../components/svg/CarIcon";
import BusIcon from "../../../../components/svg/BusIcon";
import dateRange from "../../../../utils/dateRange";
import {actions} from "../../../../redux/store";
import useTravel from "../../hooks/useTravel";

import './TravelSettings.css'


const defaultTags = [
    {id: 1, icon: <WalkIcon className='img-abs' />, title: 'пешком'},
    {id: 2, icon: <CarIcon className='img-abs'/>, title: 'авто'},
    {id: 3, icon: <BusIcon className='img-abs'/>, title: 'общественный транспорт'},
]

export default function TravelSettings() {
    const {travelCode} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const travel = useTravel(travelCode)

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

    useEffect(() => {
        if (travel) dispatch(actions.travelActions.selectTravel(travel))
    }, [travel])

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
    function handleMovementSelect(movementType){
        if(!travel) return

        if (travel.movementTypes.includes(movementType)){
            travel.movementTypes = travel.movementTypes.filter(m => m !== movementType)
        } else{
            travel.movementTypes = [...travel.movementTypes, movementType]
        }
    }

    console.log(travel)

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
                                            placeholder='Дата'
                                        />
                                        <Input
                                            className='br-left-0'
                                            type='date'
                                            placeholder='Дата'
                                        />
                                    </div>
                                </section>

                                <section className='travel-settings-members column gap-0.5 block'>
                                    <h4 className='title-semi-bold'>Участники</h4>
                                    <TravelPeople peopleList={[travel.owner_id]} onClick={handleUserClick}/>
                                    <div className='center'>
                                        <AddButton>Добавить еще</AddButton>
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

                                {/*<section className='travel-settings-movement column gap-0.5 block'>*/}
                                {/*    <h4 className='title-semi-bold'>Способы передвижения</h4>*/}
                                {/*    <div className='flex-wrap gap-1'>*/}
                                {/*        {*/}
                                {/*            defaultTags.map(t => (*/}
                                {/*                <Chip*/}
                                {/*                    key={t.id}*/}
                                {/*                    icon={t.icon}*/}
                                {/*                    color={travel.movementTypes.includes(t.id) ? 'orange' : 'grey'}*/}
                                {/*                    rounded*/}
                                {/*                    onClick={() => handleMovementSelect(t)}*/}
                                {/*                >*/}
                                {/*                    {t.title}*/}
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
                <Button>Построить маршрут</Button>
            </div>
        </div>
    )
}