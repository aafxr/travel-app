import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Container from "../../../../components/Container/Container";
import Button from "../../../../components/ui/Button/Button";
import {Chip, Input, PageHeader} from "../../../../components/ui";
import constants from "../../../../static/constants";
import AddButton from "../../../../components/ui/AddButtom/AddButton";

export default function TravelSettings() {
    const {travelCode} = useParams()
    const {travels} = useSelector(store => store[constants.redux.TRAVEL])
    const [travel, setTravel] = useState(null)

    useEffect(() => {
        if (travels && travels.length) {
            const idx = travels.findIndex(t => t.id === travelCode)
            if (~idx) setTravel(travels[idx])
            else pushAlertMessage({type: "info", message: 'Не удалось найти детали путешествия'})
        }
    }, [travels])

    if (!travel) return <div>загрузка информации о путешествии</div>

    return (
        <div className='wrapper'>
            <Container>
                <PageHeader to={`/travel/${travelCode}/`} title={'Параметры'}/>
                <div className='content column gap-1'>
                    {
                        travel.direction && (
                            <section className='travel-settings-dirrection'>
                                <h4 className='title-semi-bold'>Направление</h4>
                                <div className='travel-settings-dirrection-title flex-between'>
                                    <Chip color='light-orange' rounded >
                                     {travel.direction}
                                    </Chip>
                                </div>
                            </section>
                        )
                    }

                    <section className='travel-settings-date'>
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

                    <section className='travel-settings-members'>
                        <h4 className='title-semi-bold'>Участники</h4>
                        <div className='center'>
                        <AddButton>Добавить еще</AddButton>
                        </div>
                        <div>Взрослые</div>
                        <div>Дети</div>
                    </section>

                    <section className='travel-settings-hotels'>
                        <h4 className='title-semi-bold'>Отель</h4>

                        <div className='link'>+ Добавить отель</div>
                    </section>

                    <section className='travel-settings-appointment'>
                        <h4 className='title-semi-bold'>Встреча</h4>

                        <div className='link'>+ Добавить отель</div>
                    </section>

                    <section className='travel-settings-appointment'>
                        <h4 className='title-semi-bold'>Способы передвижения</h4>

                        <div className='link'>+ Добавить отель</div>
                    </section>

                </div>
                <div className='fixed-bottom-button'>
                    <Button>Построить маршрут</Button>
                </div>
            </Container>
        </div>
    )
}