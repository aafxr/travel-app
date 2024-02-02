import clsx from "clsx";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {ChecklistIcon, MoneyIcon, VisibilityIcon, VisibilityOffIcon} from "../../../../components/svg";
import {useAppContext, useTravel, useUser} from "../../../../contexts/AppContextProvider";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import LinkComponent from "../../../../components/ui/LinkComponent/LinkComponent";
import PhotoComponent from "../../../../components/PhotoComponent/PhotoComponent";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import FlatButton from "../../../../components/FlatButton/FlatButton";
import TravelPeople from "../../components/TravelPeople/TravelPeople";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import Container from "../../../../components/Container/Container";
import Curtain from "../../../../components/Curtain/Curtain";
import {TravelService} from "../../../../classes/services";
import {Chip, PageHeader} from "../../../../components/ui";
import dateRange from "../../../../utils/dateRange";
import Menu from "../../../../components/Menu/Menu";
import {ShowRoute} from "./ShowRoute";

import './TravelDetails.css'
import {Photo} from "../../../../classes/StoreEntities/Photo";

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
    const context = useAppContext()
    const travel = useTravel()!
    const user = useUser()!

    const [compact, setCompact] = useState(false)
    const [curtainOpen, setCurtainOpen] = useState(true)
    const travelDurationLabel = dateRange(travel.date_start, travel.date_end)

    const menu = (
        <Menu>
            <LinkComponent to={`/travel/${travelCode}/description/`} title={'Описание и дата'}/>
            {/*<LinkComponent to={`/travel/${travelCode}/permissions/`} title={'Права'}/>*/}
            {/*<LinkComponent to={`/travel/${travelCode}/settings/`} title={'Редактировать детали'}/>*/}
        </Menu>
    )


    function handleTravelPhotoChange(blob: Blob) {
        travel.setPhoto(new Photo({blob}))
        if (user)
            TravelService.update(context, travel)
                .then(() => context.setTravel(travel))
                .catch(defaultHandleError)
    }

    useEffect(() => {
        if (!dayNumber) navigate(`/travel/${travel.id}/1/`)

    }, [travel])

    function handleCurtain(val = true) {
        user.setCurtain(val)
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
                            <PhotoComponent className='img-abs' src={travel.getPhotoURL} onChange={handleTravelPhotoChange}/>
                        </div>
                        <div className='travel-details-title column center'>
                            <h2 className='center gap-0.5'
                                onClick={() => navigate(`/travel/${travel.id || travelCode}/edite/`)}>
                                { travel.title || (<span className='travel-details-title--empty'>Добавить название</span>) }
                                    {travel.isPublic ? <VisibilityIcon className='travel-details-icon icon public'/> : <VisibilityOffIcon className='travel-details-icon icon private'/>}
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
                            <TravelPeople peopleList={travel.members} compact={compact}/>
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
                        {
                            travel.permit("showCheckList") && <IconButton
                                icon={<ChecklistIcon/>}
                                title='Чек-лист'
                                onClick={() => navigate(`/travel/${travelCode}/checklist/`)}
                            />
                        }
                        {/*<IconButton icon={<ChatIcon badge/>}/>*/}
                    </div>
                </div>
            </Container>

            <Curtain
                direction={travelDurationLabel/*travel.routeBuilder.getPlacesAtDay(+dayNumber)[0]?.name*/}
                onChange={handleCurtain}
                defaultOffsetPercents={curtainOpen ? 0 : 1}

            >
                <ShowRoute/>
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
