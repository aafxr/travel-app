import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import LinkComponent from "../../../../components/ui/LinkComponent/LinkComponent";
import {ChatIcon, ChecklistIcon, Money} from "../../../../components/svg";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import TravelPeople from "../../components/TravelPeople/TravelPeople";
import AddButton from "../../../../components/ui/AddButtom/AddButton";
import Container from "../../../../components/Container/Container";
import {Chip, PageHeader} from "../../../../components/ui";
import Menu from "../../../../components/Menu/Menu";

import './TravelDetails.css'


export default function TravelDetails() {
    const {travelCode} = useParams()
    const [compact, setCompact] = useState(false)
    const navigate = useNavigate()


    const menu = (
        <Menu className='travel-menu '>
            <LinkComponent to={`/travel/${travelCode}/params/`} title={'Параметры'}/>
            <LinkComponent to={`/travel/${travelCode}/edite/`} title={'Редактировать'}/>
        </Menu>
    )
    // const items = [
    //     {id: 1, entityType: 'Прокат', entityName: 'Велопрокат'},
    //     {id: 2, entityType: 'Кафе', entityName: 'Malina'},
    //     {id: 3, entityType: 'Кафе', entityName: 'Brusnika'},
    // ]

    return (
        <>
            <Container className='travel-details-header'>
                <PageHeader arrowBack MenuEl={menu}/>
            </Container>
            <Container className='travel-details-backface '>
                <div className='wrapper column gap-1 pb-20 '>
                <div className='travel-details'>
                    <img className='img-abs' src={process.env.PUBLIC_URL + '/images/travel-img.png'} alt="details"/>
                </div>
                <div className='travel-details-title column center'>
                    <h2 onClick={() => navigate('')}>Едем на Алтай</h2>
                    <div className='travel-details-subtitle center'>из Новосибирска - на авто</div>
                </div>
                <div className='center'>
                    <Chip className='center' color='orange' rounded>17-21 июля</Chip>
                </div>
                    <div className='content'>
                        <TravelPeople compact={compact}/>
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
                    <div className='flex-between flex-nowrap gap-0.5 footer'>
                        <IconButton icon={<Money/>} title='Расходы'/>
                        <IconButton icon={<ChecklistIcon/>} title='Чек-лист'/>
                        <IconButton icon={<ChatIcon badge/>}/>
                    </div>
                </div>

            </Container>

            {/*<Curtain>*/}
            {/*    <Container>*/}
            {/*        <div className='flex-between gap-1'>*/}
            {/*            <Button>по дням</Button>*/}
            {/*            <Button>на карте</Button>*/}
            {/*            <Button>все места</Button>*/}
            {/*        </div>*/}
            {/*    </Container>*/}
            {/*    <div className='travel-tab-container flex-stretch flex-nowrap hide-scroll'>*/}
            {/*        <Tab name='1 день'/>*/}
            {/*        <Tab name='2 день'/>*/}
            {/*        <Tab name='3 день'/>*/}
            {/*        <Tab name='4 день'/>*/}
            {/*        <Tab name='5 день'/>*/}
            {/*        <Tab name='6 день'/>*/}
            {/*        <Tab name='7 день'/>*/}
            {/*    </div>*/}
            {/*    <Container className='pt-20 pb-20'>*/}
            {/*        <LocationCard*/}
            {/*            title='Новосибирск-Сочи'*/}
            {/*            entityType='Перелет'*/}
            {/*            dateStart={Date.now() - 1000 * 60 * 60 * 2}*/}
            {/*            dateEnd={Date.now()}*/}
            {/*        />*/}
            {/*        <RecommendLocation items={items}/>*/}
            {/*        <LocationCard*/}
            {/*            title='Новосибирск-Сочи'*/}
            {/*            entityType='Перелет'*/}
            {/*            dateStart={Date.now() - 1000 * 60 * 60 * 2.1}*/}
            {/*            dateEnd={Date.now()}*/}
            {/*        />*/}
            {/*        <RecommendLocation items={items}/>*/}
            {/*        <LocationCard*/}
            {/*            title='Новосибирск-Сочи'*/}
            {/*            entityType='Перелет'*/}
            {/*            dateStart={Date.now() - 1000 * 60 * 60 * 2.1}*/}
            {/*        />*/}
            {/*        <AddButton>Добавить локацию</AddButton>*/}
            {/*    </Container>*/}
            {/*</Curtain>*/}
        </>
    )
}
