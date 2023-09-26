import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import TravelPeople from "../../components/TravelPeople/TravelPeople";
import Container from "../../../../components/Container/Container";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import Counter from "../../../../components/Counter/Counter";
import Button from "../../../../components/ui/Button/Button";
import constants from "../../../../static/constants";

export default function TravelSettings() {
    const {travelCode} = useParams()
    const navigate = useNavigate()
    const {travels} = useSelector(store => store[constants.redux.TRAVEL])
    const [travel, setTravel] = useState(null)

    /** поиск путешествия соответствующего travelCode */
    useEffect(() => {
        if (travels && travels.length) {
            const idx = travels.findIndex(t => t.id === travelCode)
            if (~idx) setTravel(travels[idx])
            else pushAlertMessage({type: "info", message: 'Не удалось найти детали путешествия'})
        }
    }, [travels])

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

    if (!travel) return <div>загрузка информации о путешествии</div>

    return (
        <div className='travel-settings wrapper'>
            <Container>
                <PageHeader arrowBack to={`/travel/${travelCode}/`} title={'Параметры'}/>
            </Container>
            <Container className='content'>
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
                            <span >Взрослые</span>
                            <Counter initialValue={2} min={2} onChange={handleAdultChange}/>
                        </div>
                        <div className='flex-between'>
                            <span>Дети</span>
                            <Counter initialValue={0} min={0} onChange={handleTeenagerChange}/>
                        </div>
                    </section>

                    <section className='travel-settings-hotels column gap-0.5 block'>
                        <h4 className='title-semi-bold'>Отель</h4>

                        <div
                            className='link'
                            onClick={() => navigate(`/travel/${travelCode}/add/hotel/`)}
                        >
                            + Добавить отель
                        </div>
                    </section>

                    <section className='travel-settings-appointment column gap-0.5 block'>
                        <h4 className='title-semi-bold'>Встреча</h4>

                        <div
                            className='link'
                            onClick={() => navigate(`/travel/${travelCode}/add/appointment/`)}
                        >
                            + Добавить отель
                        </div>
                    </section>

                    <section className='travel-settings-appointment column gap-0.5 block'>
                        <h4 className='title-semi-bold'>Способы передвижения</h4>

                        <div className='link'>+ Добавить отель</div>
                    </section>

                </div>
            </Container>
                <div className='footer-btn-container footer'>
                    <Button>Построить маршрут</Button>
                </div>
        </div>
    )
}