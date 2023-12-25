import clsx from "clsx";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {ChecklistIcon, Money, VisibilityIcon, VisibilityOffIcon} from "../../../../components/svg";
import LinkComponent from "../../../../components/ui/LinkComponent/LinkComponent";
import FlatButton from "../../../../components/FlatButton/FlatButton";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import TravelPeople from "../../components/TravelPeople/TravelPeople";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import Container from "../../../../components/Container/Container";
import useTravelContext from "../../../../hooks/useTravelContext";
import useUserSelector from "../../../../hooks/useUserSelector";
import {Chip, PageHeader} from "../../../../components/ui";
import Curtain from "../../../../components/Curtain/Curtain";
import Button from "../../../../components/ui/Button/Button";
import Photo from "../../../../components/Poto/Photo";
import storeDB from "../../../../db/storeDB/storeDB";
import constants from "../../../../static/constants";
import dateRange from "../../../../utils/dateRange";
import Menu from "../../../../components/Menu/Menu";
import ShowRouteByDays from "./ShowRouteByDays";
import ShowRouteOnMap from "./ShowRouteOnMap";
import ShowPlaces from "./ShowPlaces";

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
    const {travel, update, travelObj} = useTravelContext()
    const [compact, setCompact] = useState(false)
    const [curtainOpen, setCurtainOpen] = useState(true)
    const travelDurationLabel = dateRange(travelObj.date_start, travelObj.date_end)

    const menu = (
        <Menu>
            <LinkComponent to={`/travel/${travelCode}/params/`} title={'Детали путешествия'}/>
            <LinkComponent to={`/travel/${travelCode}/edite/`} title={'Основные настройки'}/>
            <LinkComponent to={`/travel/${travelCode}/settings/`} title={'Редактировать детали'}/>
        </Menu>
    )


    function handleTravelPhotoChange(photo) {
        if (travel) {
            travel.setPhoto(photo.id)

            Promise.all([
                travel.save(user.id),
                storeDB.editElement(constants.store.IMAGES, photo)
            ])
                .then(() => update())
                .catch(console.error)
        }
    }

    useEffect(() => {
        // const days = travel.routeBuilder.getActivityDays()
        if (!dayNumber ) navigate(`/travel/${travelObj.id}/1/`)
        // if (!dayNumber || (days.length && !days.includes(+dayNumber))) navigate(`/travel/${travelObj.id}/${days[0] || 1}/`)

        // travel
        //     .routeBuilder
        //     .createActivitiesList()
        // setCurtainOpen(travel.isCurtainOpen)
    }, [travel])

    function handleCurtain(val = true) {
        travel.setCurtainOpen(val)
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
                            <Photo className='img-abs' id={travelObj.photo} onChange={handleTravelPhotoChange}/>
                        </div>
                        <div className='travel-details-title column center'>
                            <h2 className='center gap-0.5'
                                onClick={() => navigate(`/travel/${travelObj.id || travelCode}/edite/`)}>
                                {
                                    travelObj?.title || travelObj?.direction || (
                                        <span className='travel-details-title--empty'>Добавить название</span>
                                    )
                                }
                                <div
                                    className={`travel-details-icon icon center ${travelObj.isPublic ? 'public' : 'private'}`}>
                                    {travelObj?.isPublic ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                                </div>
                            </h2>
                            <div className='travel-details-subtitle center'>{travelObj?.description}</div>
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

                            <TravelPeople peopleList={travelObj?.owner_id ? [travelObj?.owner_id] : []} compact={compact}/>
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
                        <IconButton icon={<Money/>} title='Расходы'
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
                                onClick={() => travel.setTravelDetailsFilter('byDays')}
                                active={travel.travelDetailsFilter === 'byDays'}
                            >по дням</Button>
                            <Button
                                onClick={() => travel.setTravelDetailsFilter('onMap')}
                                active={travel.travelDetailsFilter === 'onMap'}
                            >на карте</Button>
                            <Button
                                onClick={() => travel.setTravelDetailsFilter('allPlaces')}
                                active={travel.travelDetailsFilter === 'allPlaces'}
                            >все места</Button>
                        </div>
                    </Container>

                    {
                        travel.travelDetailsFilter === 'allPlaces' && <ShowPlaces/>
                    }
                    {
                        travel.travelDetailsFilter === 'onMap' && <ShowRouteOnMap/>
                    }
                    {
                        travel.travelDetailsFilter === 'byDays' && <ShowRouteByDays/>
                    }
                </div>
            </Curtain>
            {curtainOpen &&
                <FlatButton
                    className={'travel-details-buttons'}
                    onHotel={() => navigate(`/travel/${travelObj.id}/add/hotel/`)}
                    onInvite={() => navigate(`/travel/${travelObj.id}/settings/invite/`)}
                    onAppointment={() => navigate(`/travel/${travelObj.id}/add/appointment/`)}
                    onPlace={() => navigate(`/travel/${travelObj.id}/add/place/`)}
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
