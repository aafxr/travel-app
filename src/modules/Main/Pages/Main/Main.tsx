import React from 'react'
import {useNavigate} from "react-router-dom";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {useUser, useAppContext} from "../../../../contexts/AppContextProvider";
import Navigation from "../../../../components/Navigation/Navigation";
import Container from "../../../../components/Container/Container";
import {TravelService} from "../../../../classes/services";
import {PageHeader} from "../../../../components/ui";
import Menu from "../../../../components/Menu/Menu";

import './Main.css'
import YandexMapContainer from "../../../../components/YandexMap/YandexMapContainer";
import YPlaceMark from "../../../../components/YandexMap/YPlaceMark";

/**
 * компонент отображает главную страницу приложения
 * @function
 * @name Main
 * @category Pages
 */
export default function Main() {
    const navigate = useNavigate()
    const user = useUser()
    const context = useAppContext()

    async function handleNewTravel() {
        if (user) {
            TravelService.create(context)
                .then((travel) => {
                    context.setTravel(travel)
                    navigate(`/travel/add/`)
                })
                .catch(defaultHandleError)
        } else {
            navigate('/login/')
        }
    }

    return (
        <div className='wrapper'>
            <Container>
                <PageHeader title={'Главная страница'} MenuEl={<Menu/>}/>
            </Container>
            <Container className='content pb-20'>
                <div className='banner'>
                    <h2 className='banner-title'>Спланируйте поездку за минуты</h2>
                    <button
                        className='banner-button'
                        onClick={handleNewTravel}
                    >
                        {user ? 'Новая поездка' : 'Авторизоваться'}
                    </button>
                </div>
                <YandexMapContainer>
                    <YPlaceMark coordinates={[50,50]} />
                </YandexMapContainer>
                {/*<PopularSection/>*/}
                {/*<RecommendSection/>*/}

                {/*<IconButton*/}
                {/*    border={false}*/}
                {/*    title='+ Добавить'*/}
                {/*    className='link'*/}
                {/*    onClick={() => navigate('/travel/add/')}*/}
                {/*/>*/}
            </Container>
            <Navigation className='footer'/>
        </div>
    )
}
