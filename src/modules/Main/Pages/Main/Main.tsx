import React from 'react'
import {useNavigate} from "react-router-dom";

import Navigation from "../../../../components/Navigation/Navigation";
import Container from "../../../../components/Container/Container";
import {useUser} from "../../../../contexts/AppContextProvider";
import {PageHeader} from "../../../../components/ui";
import Menu from "../../../../components/Menu/Menu";

import PopularSection from "../../../../components/PopularSection/PopularSection";

import './Main.css'


/**
 * компонент отображает главную страницу приложения
 * @function
 * @name Main
 * @category Pages
 */
export default function Main() {
    const navigate = useNavigate()
    const user = useUser()
    // const context = useAppContext()

    async function handleNewTravel() {
        if (user) {
            // const travel = new Travel({})
            // context.setTravel(travel)
            navigate(`/travel/add/`)
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
                <div className='banner' style={{
                    backgroundImage: 'url(/images/main.jpg)'
                }}>
                    <h2 className='banner-title'>Спланируйте поездку за минуты</h2>
                    <button
                        className='banner-button'
                        onClick={handleNewTravel}
                    >
                        {user ? 'Новая поездка' : 'Авторизоваться'}
                    </button>
                </div>


                <PopularSection />
                {/*<RecommendSection routes={[]}/>*/}

                {/*<IconButton*/}
                {/*    border={false}*/}
                {/*    title='+ Добавить'*/}
                {/*    className='link'*/}
                {/*    onClick={() => navigate('/travel/add/')}*/}
                {/*/>*/}
            </Container>
            {/*<YandexMapContainer className='content'>*/}
            {/*    {test_places.map((p, idx) => (*/}
            {/*        <YPlacemark key={idx} coordinates={[p.location[0], p.location[1]]} iconContent={`${idx}`}/>*/}
            {/*    ))}*/}
            {/*    <YPolyline rout={test_places.slice(0, test_places.length /2).map(p => [p.location[0],p.location[1]])} strokeWidth={3} strokeColor={'#329811'}/>*/}
            {/*    <YPolyline rout={test_places.slice(test_places.length /2).map(p => [p.location[0],p.location[1]])} strokeWidth={3} strokeColor={'#000f11'}/>*/}
            {/*</YandexMapContainer>*/}
            <Navigation className='footer'/>
        </div>
    )
}
