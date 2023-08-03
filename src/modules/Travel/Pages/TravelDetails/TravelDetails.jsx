import React, {useRef, useState} from "react";
import clsx from "clsx";

import RecommendLocation from "../../components/RecommendLocation/RecommendLocation";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import LocationCard from "../../components/LocationCard/LocationCard";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import Container from "../../../../components/Container/Container";
import {Chip, PageHeader, Tab} from "../../../../components/ui";
import Button from "../../../../components/ui/Button/Button";
import UserCard from "../../components/UserCard/UserCard";

import {BellIcon, ChatIcon, ChecklistIcon, CopyIcon, LinkIcon, MenuIcon, Money} from "../../../../components/svg";

import './TravelDetails.css'
import swipeBarHandler from "./swipeBarHandler";

    const icons = [<CopyIcon key={1}/>, <LinkIcon key={2}/>, <BellIcon key={3}/>, <MenuIcon key={4}/>]

export default function TravelDetails() {
    const [scrolled, setScrolled] = useState(true)
    const tdref = useRef()

    const items = [
        { id: 1, entityType: 'Прокат', entityName: 'Велопрокат'},
        { id: 2, entityType: 'Кафе', entityName: 'Malina'},
        { id: 3, entityType: 'Кафе', entityName: 'Brusnika'},
    ]

    return (
        <>
            <Container className='travel-details-header'>
                <PageHeader arrowBack icons={icons}/>
            </Container>
            <Container className='travel-details-backface column gap-1 pb-20'>
                <div className='travel-details'>
                    <img className='img-abs' src={process.env.PUBLIC_URL + '/images/travel-img.png'} alt="details"/>
                </div>
                <div className='travel-details-title column center'>
                    <h2>Едем на Алтай</h2>
                    <div className='travel-details-subtitle center'>из Новосибирска - на авто</div>
                </div>
                <div className='center'>
                    <Chip className='center' color='orange' rounded>17-21 июля</Chip>
                </div>
                <div className='travel-details-people column gap-0.25'>
                    <UserCard name='Иван' role='админ' status='в поездке'
                              vehicle={process.env.PUBLIC_URL + '/icons/directions_car.svg'}
                              avatarURL={process.env.PUBLIC_URL + '/images/Ellipse 4.png'}/>
                    <UserCard name='Иван' role='админ' status='в поездке'
                              vehicle={process.env.PUBLIC_URL + '/icons/directions_car.svg'}
                              avatarURL={process.env.PUBLIC_URL + '/images/Ellipse 4.png'}/>
                    <UserCard name='Иван' role='админ' status='в поездке'
                              vehicle={process.env.PUBLIC_URL + '/icons/directions_car.svg'}
                              avatarURL={process.env.PUBLIC_URL + '/images/Ellipse 4.png'}/>
                    <UserCard name='Иван' role='админ' status='в поездке'
                              vehicle={process.env.PUBLIC_URL + '/icons/directions_car.svg'}
                              avatarURL={process.env.PUBLIC_URL + '/images/Ellipse 4.png'}/>
                </div>
                <div className='flex-between'>
                <AddButton>Пригласить еще</AddButton>
                    <span className='link'>Свернуть</span>
                </div>
                <div className='flex-between flex-nowrap gap-0.5'>
                    <IconButton icon={<Money/>} title='Расходы'/>
                    <IconButton icon={<ChecklistIcon/>} title='Чек-лист'/>
                    <IconButton icon={<ChatIcon badge/>}/>
                </div>
            </Container>

            <div ref={tdref} className='travel-days'>
                <div className='center'>
                    <button className='travel-days-top-btn' onClick={() => tdref.current && swipeBarHandler(tdref.current)}/>
                </div>
                <Container>
                    <div className='flex-between gap-1'>
                        <Button>по дням</Button>
                        <Button>на карте</Button>
                        <Button>все места</Button>
                    </div>
                </Container>
                <div className='travel-tab-container flex-stretch flex-nowrap hide-scroll'>
                    <Tab name='1 день'/>
                    <Tab name='2 день'/>
                    <Tab name='3 день'/>
                    <Tab name='4 день'/>
                    <Tab name='5 день'/>
                    <Tab name='6 день'/>
                    <Tab name='7 день'/>
                </div>
                <Container className='pt-20 pb-20'>
                    <LocationCard
                        title='Новосибирск-Сочи'
                        entityType='Перелет'
                        dateStart={Date.now() - 1000 * 60 * 60 * 2}
                        dateEnd={Date.now()}
                    />
                    <RecommendLocation items={items} />
                    <LocationCard
                        title='Новосибирск-Сочи'
                        entityType='Перелет'
                        dateStart={Date.now() - 1000 * 60 * 60 * 2.1}
                        dateEnd={Date.now()}
                    />
                    <RecommendLocation items={items} />
                    <LocationCard
                        title='Новосибирск-Сочи'
                        entityType='Перелет'
                        dateStart={Date.now() - 1000 * 60 * 60 * 2.1}
                    />
                    <AddButton>Добавить локацию</AddButton>
                </Container>
            </div>
        </>
    )
}