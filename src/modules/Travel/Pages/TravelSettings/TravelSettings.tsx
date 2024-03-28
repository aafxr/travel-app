import React from "react";
import {useNavigate} from "react-router-dom";

import RadioButtonGroup, {RadioButtonGroupItemType} from "../../../../components/RadioButtonGroup/RadioButtonGroup";
import {useAppContext, useUser} from "../../../../contexts/AppContextProvider";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {defaultMovementTags} from "../../../../components/defaultMovementTags";
import TravelPeople from "../../components/TravelPeople/TravelPeople";
import ToggleBox from "../../../../components/ui/ToggleBox/ToggleBox";
import NumberInput from "../../../../components/ui/Input/NumberInput";
import {TravelPreference} from "../../../../types/TravelPreference";
import Container from "../../../../components/Container/Container";
import DateRange from "../../../../components/DateRange/DateRange";
import {useTravelState} from "../../../../hooks/useTravelState";
import Counter from "../../../../components/Counter/Counter";
import Button from "../../../../components/ui/Button/Button";
import {MovementType} from "../../../../types/MovementType";
import {TravelService} from "../../../../classes/services";
import {Chip, PageHeader} from "../../../../components/ui";
import {Member} from "../../../../classes/StoreEntities";
import {Travel} from "../../../../classes/StoreEntities";

import './TravelSettings.css'
import TravelInterests from "../../../../components/TravelInterests/TravelInterests";
import {Preference} from "../../../../classes/Preference";


const sightseeingTime: RadioButtonGroupItemType[] = [
    {id: 1, title: 'Низкая'},
    {id: 2, title: 'Средняя'},
    {id: 3, title: 'Высокая'},
]

const depth: RadioButtonGroupItemType[] = [
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
    const user = useUser()!
    const context = useAppContext()
    const navigate = useNavigate()

    const [state, updateState] = useTravelState(context.travel)


    /** обработка нажатия на карточку пользователя */
    const handleUserClick = (user: Member) => {
        if(!context.travel) return
        navigate(`/travel/${context.travel.id}/settings/${user.id}/`)
    }


    /** добавление / удаление способа перемещения во время маршрута */
    function handleMovementSelect(movementType: MovementType) {
        if (!state) return;
        if (state.travel.movementTypes.length === 1 && movementType === state.travel.movementTypes[0]) return
        if (state.travel.movementTypes.includes(movementType))
            state.travel.movementTypes = state.travel.movementTypes.filter(mt => mt !== movementType)
        else
            state.travel.movementTypes = [...state.travel.movementTypes, movementType]
        updateState({...state})
    }


    /** обработчик изменения времени */
    function handleDateRangeChange({start, end}: { start?: Date, end?: Date }) {
        if (!state) return;
        const t = new Travel(state.travel)
        if (start) Travel.setDate_start(t, start)
        if (end) Travel.setDate_end(t, end)
        updateState({...state, travel: t})
    }

    function handleTravelDays(d: number) {
        if (!state) return
        if (d < 1) return

        Travel.setDays(state.travel, d)
        updateState({...state})
    }


    function handleDensityChange(select: RadioButtonGroupItemType[]) {
        if (!state) return;
        state.travel.preference.density = select[0].id as TravelPreference['density']
        updateState({...state})
    }


    function handleDepthChange(select: RadioButtonGroupItemType[]) {
        if (!state) return;
        state.travel.preference.depth = select[0].id as TravelPreference['depth']
        updateState({...state})
    }


    /** сохранение параметров путешествия */
    function handleSaveTravelButton() {
        if (!user) return
        if (!state) return;
        const t = new Travel(state.travel)
        TravelService.create(context, t, user)
            .then(() => context.setTravel(t))
            .then(() => navigate(`/travel/${state.travel.id}/advice-route/`))
            .catch(defaultHandleError)
    }


    function handleToggleBoxChanged(isPublic: boolean) {
        if (!state) return
        state.travel.permission.public = isPublic ? 1 : 0
        updateState({...state})
    }


    function handleMembersCountChange(num: number) {
        if (!state) return
        state.travel.members_count = num
        updateState({...state})
    }

    function handleChildrenCountChange(num: number) {
        if (!state) return
        state.travel.children_count = num
        updateState({...state})
    }

    function handleInterestsChange(key: keyof Preference['interests']) {
        if (!state) return
        Travel.getInterest(state.travel, key)
            ? state.travel.preference.interests[key] = 0
            : state.travel.preference.interests[key] = 1
        updateState({...state})
    }


    if (!state) return null


    return (
        <>
            <div className='travel-settings wrapper'>
                <Container>
                    <PageHeader arrowBack title={'Параметры'}/>
                </Container>
                <Container className='content overflow-x-hidden'>
                    <div className='content column'>
                        <section className='travel-settings-dirrection block'>
                            <h4 className='title-semi-bold'>Направление</h4>
                            <div className='travel-settings-dirrection-title row'>
                                <Chip color='light-orange' rounded>
                                    {state.travel.direction || state.travel.title}
                                </Chip>
                            </div>
                        </section>

                        <section className='travel-settings-date column gap-0.5 block'>
                            <h4 className='title-semi-bold'>Дата поездки</h4>
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
                                init={state.travel.date_start.getTime() > 0 ? {
                                    start: state.travel.date_start,
                                    end: state.travel.date_end
                                } : undefined}
                                minDate={state.travel.date_start}
                                onChange={handleDateRangeChange}
                            />
                        </section>

                        <section className='travel-settings-movement column gap-0.5 block'>
                            <h4 className='title-semi-bold'>Предпочитаемый способ передвижения</h4>
                            <div className='flex-wrap gap-1'>
                                {
                                    defaultMovementTags.map(dmt => (
                                        <Chip
                                            key={dmt.id}
                                            icon={dmt.icon}
                                            color={~state.travel.movementTypes.findIndex(mt => mt === dmt.id) ? 'orange' : 'grey'}
                                            rounded
                                            onClick={() => handleMovementSelect(dmt.id)}
                                        >
                                            {dmt.title}
                                        </Chip>
                                    ))
                                }
                            </div>
                        </section>

                        <section className='block'>
                            <ToggleBox
                                className='block'
                                init={Travel.isPublic(state.travel)}
                                onChange={handleToggleBoxChanged}
                                title={"Сделать видимым для всех"}
                            />
                        </section>

                        <section className='travel-settings-members column gap-0.5 block'>
                            <h4 className='title-semi-bold'>Участники</h4>
                            <TravelPeople peopleList={Travel.getMembers(state.travel)} onClick={handleUserClick}/>
                            <div className='center'>
                                {/*<AddButton to={`/travel/${state.travelCode}/settings/invite/`}>Добавить*/}
                                {/*    участника</AddButton>*/}
                            </div>
                            <div className='flex-between'>
                                <span>Взрослые</span>
                                <Counter
                                    init={state.travel.members_count}
                                    min={state.travel.admins.length + state.travel.editors.length + state.travel.commentator.length || 1}
                                    onChange={handleMembersCountChange}
                                />
                            </div>
                            <div className='flex-between'>
                                <span>Дети</span>
                                <Counter
                                    init={state.travel.children_count}
                                    min={0}
                                    onChange={handleChildrenCountChange}
                                />
                            </div>
                        </section>

                        <section className='block'>
                            <RadioButtonGroup
                                title={'Насыщенность путешествия'}
                                checklist={sightseeingTime}
                                onChange={handleDensityChange}
                                init={sightseeingTime.find(st => st.id === context.travel?.preference.density)!}
                            />
                        </section>

                        <section className='block'>
                            <RadioButtonGroup
                                title={'Глубина осмотра '}
                                checklist={depth}
                                onChange={handleDepthChange}
                                init={depth.find(d => d.id === context.travel?.preference.depth)!}
                            />
                        </section>

                        <section className='block'>
                            <div className='title-semi-bold'>Интересы</div>
                            <TravelInterests
                                interests={state.travel.preference.interests}
                                onClick={handleInterestsChange}
                            />
                        </section>

                        <section className='block'>
                            <div className='link' onClick={() => navigate(`/travel/${state.travel.id}/details/`)}>+ Добавить
                                детали поездки
                            </div>
                        </section>

                        {/*{*/}
                        {/*    Array.isArray(updatedTravel.hotels) && updatedTravel.hotels.length > 0 && (*/}
                        {/*        <section className='travel-settings-hotels column gap-0.5 block'>*/}
                        {/*            <h4 className='title-semi-bold'>Отель</h4>*/}
                        {/*            {*/}
                        {/*                updatedTravel.hotels.map(h => (*/}
                        {/*                    <Link key={h.id} to={`/travel/${state.travel.id}/add/hotel/${h.id}/`}>*/}
                        {/*                        <div className='travel-settings-hotel'>*/}
                        {/*                            <div*/}
                        {/*                                className='travel-settings-hotel-rent'>{dateRange(h.check_in, h.check_out)}</div>*/}
                        {/*                            <div*/}
                        {/*                                className='travel-settings-hotel-title title-semi-bold'>{h.title}</div>*/}
                        {/*                        </div>*/}
                        {/*                    </Link>*/}
                        {/*                ))*/}
                        {/*            }*/}
                        {/*            /!*<div*!/*/}
                        {/*            /!*    className='link'*!/*/}
                        {/*            /!*    onClick={() => navigate(`/travel/${state.travelCode}/add/hotel/`)}*!/*/}
                        {/*            /!*>*!/*/}
                        {/*            /!*    + Добавить отель*!/*/}
                        {/*            /!*</div>*!/*/}
                        {/*        </section>*/}
                        {/*    )*/}
                        {/*}*/}

                        {/*{*/}
                        {/*    Array.isArray(updatedTravel.appointments) && updatedTravel.appointments.length > 0 && (*/}
                        {/*        <section className='travel-settings-appointments column gap-0.5 block'>*/}
                        {/*            <h4 className='title-semi-bold'>Встреча</h4>*/}
                        {/*            {*/}
                        {/*                !!updatedTravel.appointments && Array.isArray(updatedTravel.appointments) && (*/}
                        {/*                    updatedTravel.appointments.map(a => (*/}
                        {/*                        <Link key={a.id}*/}
                        {/*                              to={`/travel/${state.travel.id}/add/appointment/${a.id}/`}>*/}
                        {/*                            <div className='travel-settings-appointment'>*/}
                        {/*                                <div*/}
                        {/*                                    className='travel-settings-appointment-date'>{dateRange(a.date, a.date) + ' ' + a.time.split(':').slice(0, 2).join(':')}</div>*/}
                        {/*                                <div*/}
                        {/*                                    className='travel-settings-appointment-title title-semi-bold'>{a.title}</div>*/}
                        {/*                            </div>*/}
                        {/*                        </Link>*/}
                        {/*                    ))*/}
                        {/*                )*/}
                        {/*            }*/}
                        {/*            /!*<div*!/*/}
                        {/*            /!*    className='link'*!/*/}
                        {/*            /!*    onClick={() => navigate(`/travel/${state.travelCode}/add/appointment/`)}*!/*/}
                        {/*            /!*>*!/*/}
                        {/*            /!*    + Добавить встречу*!/*/}
                        {/*            /!*</div>*!/*/}
                        {/*        </section>*/}
                        {/*    )*/}
                        {/*}*/}


                    </div>
                </Container>
                <div className='footer-btn-container footer'>
                    <Button onClick={handleSaveTravelButton} disabled={state ? !state.change : true}>Построить
                        маршрут</Button>
                </div>
            </div>
            {/*<FlatButton*/}
            {/*    className={'buttons-block'}*/}
            {/*    onInvite={() => navigate(`/travel/${state.travel.id}/settings/invite/`)}*/}
            {/*    onHotel={() => navigate(`/travel/${state.travel.id}/add/hotel/`)}*/}
            {/*    onAppointment={() => navigate(`/travel/${travel.id}/add/appointment/`)}*/}
            {/*/>*/}
        </>
    )
}