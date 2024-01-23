import clsx from "clsx";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {ChecklistIcon, MoneyIcon, VisibilityIcon, VisibilityOffIcon} from "../../../../components/svg";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import LinkComponent from "../../../../components/ui/LinkComponent/LinkComponent";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import FlatButton from "../../../../components/FlatButton/FlatButton";
import TravelPeople from "../../components/TravelPeople/TravelPeople";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import Container from "../../../../components/Container/Container";
import useTravelContext from "../../../../hooks/useTravelContext";
import useUserSelector from "../../../../hooks/useUserSelector";
import Curtain from "../../../../components/Curtain/Curtain";
import Button from "../../../../components/ui/Button/Button";
import {Chip, PageHeader} from "../../../../components/ui";
import Photo from "../../../../components/Photo/Photo";
import dateRange from "../../../../utils/dateRange";
import Menu from "../../../../components/Menu/Menu";
import ShowRouteByDays from "./ShowRouteByDays";
import ShowRouteOnMap from "./ShowRouteOnMap";
import ShowPlaces from "./ShowPlaces";
import {DB} from "../../../../db/DB";

import './TravelDetails.css'

/**
 * Страница редактирования деталей путешествия (даты, название, описание путешествия)
 * @function
 * @name TravelDetails
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelDetails() {
    const {travelCode, dayNumber} = useParams()
    const navigate = useNavigate()
    const user = useUserSelector()
    const {travel} = useTravelContext()
    const [compact, setCompact] = useState(false)
    const [curtainOpen, setCurtainOpen] = useState(true)
    const travelDurationLabel = dateRange(travel.date_start, travel.date_end)

    const menu = (
        <Menu>
            <LinkComponent to={`/travel/${travelCode}/params/`} title={'Детали путешествия'}/>
            <LinkComponent to={`/travel/${travelCode}/edite/`} title={'Основные настройки'}/>
            <LinkComponent to={`/travel/${travelCode}/settings/`} title={'Редактировать детали'}/>
        </Menu>
    )


    function handleTravelPhotoChange(photo: Blob) {
        travel.setPhoto(photo)
        if (user)
            DB.update(travel, user, undefined, (e) => defaultHandleError(e, 'Не удалось сохранить фото'))
    }

    useEffect(() => {
        // const days = travel.routeBuilder.getActivityDays()
        if (!dayNumber) navigate(`/travel/${travel.id}/1/`)
        // if (!dayNumber || (days.length && !days.includes(+dayNumber))) navigate(`/travel/${travel.id}/${days[0] || 1}/`)

        // travel
        //     .routeBuilder
        //     .createActivitiesList()
        // setCurtainOpen(travel.isCurtainOpen)
    }, [travel])

    function handleCurtain(val = true) {
        user?.setCurtainOpen(val? 1: 0)
        setCurtainOpen(val)
    }


    return (
        <>
            <Container className='travel-details-header'>
                <PageHeader
                    to='/travels/current/'
                    className={clsx('travel-menu', {'curtain-closed': curtainOpen})}
                    arrowBack
                    MenuEl={menu}
                />
            </Container>
            <Container className='travel-details-backface '>
                <div className='wrapper column gap-1 pb-20 '>
                    <div className='content column gap-1'>
                        <div className='travel-details'>
                            <Photo className='img-abs' src={travel.imageURL} onChange={handleTravelPhotoChange}/>
                        </div>
                        <div className='travel-details-title column center'>
                            <h2 className='center gap-0.5'
                                onClick={() => navigate(`/travel/${travel.id || travelCode}/edite/`)}>
                                {
                                    travel?.title || travel?.direction || (
                                        <span className='travel-details-title--empty'>Добавить название</span>
                                    )
                                }
                                <div
                                    className={`travel-details-icon icon center ${travel.preferences.public ? 'public' : 'private'}`}>
                                    {travel.preferences.public ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                                </div>
                            </h2>
                            <div className='travel-details-subtitle center'>{travel?.description}</div>
                        </div>
                        {
                            travelDurationLabel &&
                            <div className='center'>
                                <Chip className='center' color='orange' rounded>
                                    {travelDurationLabel}
                                </Chip>
                            </div>
                        }
                        <div>

                            <TravelPeople peopleList={travel.people} compact={compact}/>
                        </div>
                        <div className='flex-between'>
                            <AddButton>Пригласить еще</AddButton>
                            <span
                                className='link'
                                onClick={() => setCompact(!compact)}
                            >
                                {compact ? 'Развернуть' : 'Свернуть'}
                            </span>
                        </div>
                    </div>
                    <div className='flex-between flex-nowrap gap-0.5 pb-20 footer'>
                        <IconButton icon={<MoneyIcon/>} title='Расходы'
                                    onClick={() => navigate(`/travel/${travelCode}/expenses/`)}/>
                        <IconButton
                            icon={<ChecklistIcon/>}
                            title='Чек-лист'
                            onClick={() => navigate(`/travel/${travelCode}/checklist/`)}
                        />
                        {/*<IconButton icon={<ChatIcon badge/>}/>*/}
                    </div>
                </div>
            </Container>

            <Curtain
                direction={travelDurationLabel/*travel.routeBuilder.getPlacesAtDay(+dayNumber)[0]?.name*/}
                onChange={handleCurtain}
                defaultOffsetPercents={curtainOpen ? 0 : 1}

            >
                <div className='h-full relative column'>

                    <Container className='flex-0'>
                        <div className='flex-between gap-1 pt-20 pb-20'>
                            <Button
                                onClick={() => user?.setTravelDetailsFilter('byDays')}
                                active={user?.travelDetailsFilter === 'byDays'}
                            >по дням</Button>
                            <Button
                                onClick={() => user?.setTravelDetailsFilter('onMap')}
                                active={user?.travelDetailsFilter === 'onMap'}
                            >на карте</Button>
                            <Button
                                onClick={() => user?.setTravelDetailsFilter('allPlaces')}
                                active={user?.travelDetailsFilter === 'allPlaces'}
                            >все места</Button>
                        </div>
                    </Container>

                    {
                        user?.travelDetailsFilter === 'allPlaces' && <ShowPlaces/>
                    }
                    {
                        user?.travelDetailsFilter === 'onMap' && <ShowRouteOnMap/>
                    }
                    {
                        user?.travelDetailsFilter === 'byDays' && <ShowRouteByDays/>
                    }
                </div>
            </Curtain>
            {curtainOpen &&
                <FlatButton
                    className={'travel-details-buttons'}
                    onHotel={() => navigate(`/travel/${travel.id}/add/hotel/`)}
                    onInvite={() => navigate(`/travel/${travel.id}/settings/invite/`)}
                    onAppointment={() => navigate(`/travel/${travel.id}/add/appointment/`)}
                    onPlace={() => navigate(`/travel/${travel.id}/add/place/`)}
                />
            }
        </>
    )
}

// <LocationCard
//     title='Новосибирск-Сочи'
//     entityType='Перелет'
//     dateStart={Date.now() - 1000 * 60 * 60 * 2}
//     dateEnd={Date.now()}
// />
// <RecommendLocation items={items}/>
// <LocationCard
//     title='Новосибирск-Сочи'
//     entityType='Перелет'
//     dateStart={Date.now() - 1000 * 60 * 60 * 2.1}
//     dateEnd={Date.now()}
// />
// <RecommendLocation items={items}/>
// <LocationCard
//     title='Новосибирск-Сочи'
//     entityType='Перелет'
//     dateStart={Date.now() - 1000 * 60 * 60 * 2.1}
// />
// <AddButton>Добавить локацию</AddButton>
