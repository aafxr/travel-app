import clsx from "clsx";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";

import RecommendLocation from "../../components/RecommendLocation/RecommendLocation";
import LinkComponent from "../../../../components/ui/LinkComponent/LinkComponent";
import {ChatIcon, ChecklistIcon, Money, VisibilityIcon, VisibilityOffIcon} from "../../../../components/svg";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import LocationCard from "../../components/LocationCard/LocationCard";
import TravelPeople from "../../components/TravelPeople/TravelPeople";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import Container from "../../../../components/Container/Container";
import {Chip, PageHeader, Tab} from "../../../../components/ui";
import Curtain from "../../../../components/Curtain/Curtain";
import Button from "../../../../components/ui/Button/Button";
import changedFields from "../../../../utils/changedFields";
import createAction from "../../../../utils/createAction";
import Photo from "../../../../components/Poto/Photo";
import storeDB from "../../../../db/storeDB/storeDB";
import constants from "../../../../static/constants";
import dateRange from "../../../../utils/dateRange";
import Menu from "../../../../components/Menu/Menu";
import {actions} from "../../../../redux/store";
import useTravel from "../../hooks/useTravel";

import './TravelDetails.css'
import useTravelContext from "../../../../hooks/useTravelContext";
import useUserSelector from "../../../../hooks/useUserSelector";

/**
 * Страница редактирования деталей путешествия (даты, название, описание путешествия)
 * @function
 * @name TravelDetails
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelDetails() {
    const {travelCode} = useParams()
    const navigate = useNavigate()
    // const dispatch = useDispatch()
    const {user} = useUserSelector()
    const {travel, update} = useTravelContext()
    const [compact, setCompact] = useState(false)
    const [curtainOpen, setCurtainOpen] = useState(true)
    const travelDurationLabel = dateRange(travel.date_start, travel.date_end)

    //переменная для задания количества табов (по дням)
    let travelDaysCount = 0
    if (travel && travel.date_start && travel.date_end) {
        travelDaysCount = (new Date(travel.date_end).getTime() - new Date(travel.date_start).getTime()) / (1000 * 60 * 60 * 24)
        travelDaysCount = Math.ceil(travelDaysCount)
    }

    const menu = (
        <Menu>
            <LinkComponent to={`/travel/${travelCode}/params/`} title={'Детали путешествия'}/>
            <LinkComponent to={`/travel/${travelCode}/edite/`} title={'Редактировать'}/>
            <LinkComponent to={`/travel/${travelCode}/settings/`} title={'Настройки'}/>
        </Menu>
    )
    const items = [
        {id: 1, entityType: 'Прокат', entityName: 'Велопрокат'},
        {id: 2, entityType: 'Кафе', entityName: 'Malina'},
        {id: 3, entityType: 'Кафе', entityName: 'Brusnika'},
    ]


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
                            <Photo className='img-abs' id={travel.photo} onChange={handleTravelPhotoChange}/>
                        </div>
                        <div className='travel-details-title column center'>
                            <h2 className='center gap-0.5' onClick={() => navigate(`/travel/${travel.id || travelCode}/edite/`)}>
                                {
                                    travel?.title || travel?.direction || (
                                        <span className='travel-details-title--empty' >Добавить название</span>
                                    )
                                }
                                <div className={`travel-details-icon icon center ${travel.isPublic ? 'public' : 'private'}`} >
                                    {travel?.isPublic ? <VisibilityIcon /> : <VisibilityOffIcon />}
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

                            <TravelPeople peopleList={travel?.owner_id ? [travel?.owner_id]: []} compact={compact}/>
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
                    <div className='flex-between flex-nowrap gap-0.5 pb-20'>
                        <IconButton icon={<Money/>} title='Расходы' onClick={() => navigate(`/travel/${travelCode}/expenses/`)}/>
                        <IconButton
                            icon={<ChecklistIcon/>}
                            title='Чек-лист'
                            onClick={() => navigate(`/travel/${travelCode}/checklist/`)}
                        />
                        <IconButton icon={<ChatIcon badge/>}/>
                    </div>
                    </div>
                </div>
            </Container>

            <Curtain
                direction={travel?.direction}
                onChange={setCurtainOpen}
                defaultOffsetPercents={1}
            >
                <Container>
                    <div className='flex-between gap-1 pt-20'>
                        <Button>по дням</Button>
                        <Button>на карте</Button>
                        <Button>все места</Button>
                    </div>
                </Container>
                {
                    !!travelDaysCount &&
                    <div className='travel-tab-container flex-stretch flex-nowrap hide-scroll'>
                        {
                            !!travelDaysCount &&
                            new Array(travelDaysCount)
                                .fill(0)
                                .map(
                                    (_, i) => (<Tab key={i} name={`${i + 1} день`}/>)
                                )
                        }
                    </div>
                }
                <Container className='overflow-x-hidden pt-20 pb-20'>
                    <LocationCard
                        title='Новосибирск-Сочи'
                        entityType='Перелет'
                        dateStart={Date.now() - 1000 * 60 * 60 * 2}
                        dateEnd={Date.now()}
                    />
                    <RecommendLocation items={items}/>
                    <LocationCard
                        title='Новосибирск-Сочи'
                        entityType='Перелет'
                        dateStart={Date.now() - 1000 * 60 * 60 * 2.1}
                        dateEnd={Date.now()}
                    />
                    <RecommendLocation items={items}/>
                    <LocationCard
                        title='Новосибирск-Сочи'
                        entityType='Перелет'
                        dateStart={Date.now() - 1000 * 60 * 60 * 2.1}
                    />
                    <AddButton>Добавить локацию</AddButton>
                </Container>
            </Curtain>
        </>
    )
}
