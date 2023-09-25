import clsx from "clsx";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";

import RecommendLocation from "../../components/RecommendLocation/RecommendLocation";
import LinkComponent from "../../../../components/ui/LinkComponent/LinkComponent";
import {ChatIcon, ChecklistIcon, Money} from "../../../../components/svg";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import LocationCard from "../../components/LocationCard/LocationCard";
import TravelPeople from "../../components/TravelPeople/TravelPeople";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import Container from "../../../../components/Container/Container";
import CheckList from "../../../../components/CheckList/CheckList";
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
import './TravelDetails.css'


export default function TravelDetails() {
    const {user} = useSelector(state => state[constants.redux.USER])
    const dispatch = useDispatch()
    const {travelCode} = useParams()
    const {travels} = useSelector(state => state[constants.redux.TRAVEL])
    const [travel, setTravel] = useState(null)
    const [compact, setCompact] = useState(false)
    const [curtainOpen, setCurtainOpen] = useState(true)
    const [checkListOpen, setCheckListOpen] = useState(false)
    const navigate = useNavigate()

    //переменная для задания количества табов (по дням)
    let travelDaysCount
    if (travel) {
        if (travel.start && travel.end) {
            travelDaysCount = (new Date(travel.end) - new Date(travel.start)) / (1000 * 60 * 60 * 24)
        }
    }

    const travelDurationLabel = dateRange(travel?.start, travel?.end)

    useEffect(() => {
        async function tryFindTravel() {
            let currentTravel = travels?.find(t => t.id === travelCode)

            if (!currentTravel) {
                currentTravel = await storeDB.getOne(constants.store.TRAVEL, travelCode)
            }
            setTravel(currentTravel || null)
        }

        tryFindTravel()
    }, [])


    const menu = (
        <Menu>
            <LinkComponent to={`/travel/${travelCode}/params/`} title={'Детали путешествия'}/>
            <LinkComponent to={`/travel/${travelCode}/edite/`} title={'Редактировать'}/>
        </Menu>
    )
    const items = [
        {id: 1, entityType: 'Прокат', entityName: 'Велопрокат'},
        {id: 2, entityType: 'Кафе', entityName: 'Malina'},
        {id: 3, entityType: 'Кафе', entityName: 'Brusnika'},
    ]


    function handleTravelPhotoChange(photo) {
        if (travel) {
            const newTravelData = {...travel, photo: photo.id}
            const keys = changedFields(travel, newTravelData, ['id', 'photo'])
            const updateTravelData = keys.reduce((acc, k) => {
                acc[k] = newTravelData[k]
                return acc
            }, {})
            const action = createAction(constants.store.TRAVEL, user.id, 'update', updateTravelData)

            Promise.all([
                storeDB.editElement(constants.store.TRAVEL, newTravelData),
                storeDB.addElement(constants.store.TRAVEL_ACTIONS, action),
                storeDB.editElement(constants.store.IMAGES, photo)
            ])
                .then(() => dispatch(actions.travelActions.updateTravels(newTravelData)))
                .catch(console.error)
        }
    }

    useEffect(() => {travel && (window.travel = travel)}, [travel])
    console.log(travel)

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
                    <div className='content column gap-0.5'>
                        <div className='travel-details'>
                            <Photo className='img-abs' id={travel?.photo} onChange={handleTravelPhotoChange}/>
                        </div>
                        <div className='travel-details-title column center gap-0.25'>
                            <h2 className='' onClick={() => navigate('')}>{travel?.title}</h2>
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

                        <TravelPeople peopleList={travel?.owner_id && [travel?.owner_id]} compact={compact}/>
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
                    <div className='flex-between flex-nowrap gap-0.5 footer pb-20'>
                        <IconButton icon={<Money/>} title='Расходы'/>
                        <IconButton
                            icon={<ChecklistIcon/>}
                            title='Чек-лист'
                            onClick={() => setCheckListOpen(true)}
                        />
                        <IconButton icon={<ChatIcon badge/>}/>
                    </div>
                </div>
            </Container>
            {checkListOpen && <CheckList isVisible={checkListOpen} close={() => setCheckListOpen(false)}/>}

            <Curtain
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
                <Container className='pt-20 pb-20'>
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
