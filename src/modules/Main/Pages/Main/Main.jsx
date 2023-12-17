import React, {useEffect} from 'react'
import {useNavigate} from "react-router-dom";

import Navigation from "../../../../components/Navigation/Navigation";
import Container from "../../../../components/Container/Container";
import useUserSelector from "../../../../hooks/useUserSelector";
import {PageHeader} from "../../../../components/ui";
import Menu from "../../../../components/Menu/Menu";
import Travel from "../../../../classes/Travel";

import './Main.css'

/**
 * компонент отображает главную страницу приложения
 * @function
 * @name Main
 * @category Pages
 */
export default function Main({
                                 primary_entity_type,
                                 primary_entity_id
                             }) {
    const navigate = useNavigate()
    const user = useUserSelector()

    function handleNewTravel() {
        if (user) {
            Travel
                .newTravel(user.id)
                .save(user.id)
                .then((t) => navigate(`/travel/${t.object.id}/map/`))
                .catch(console.error)
        } else{
            navigate('/login/')
        }
    }

    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader title={'Главная страница'} MenuEl={<Menu/>}/>
                <div className='banner'>
                    <h2 className='banner-title'>Спланируйте поездку за минуты</h2>
                    <button
                        className='banner-button'
                        onClick={handleNewTravel}
                    >
                        {user ? 'Новая поездка' : 'Авторизоваться'}
                    </button>
                </div>
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
