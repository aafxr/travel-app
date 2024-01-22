import React from 'react'
import {useNavigate} from "react-router-dom";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import Navigation from "../../../../components/Navigation/Navigation";
import Container from "../../../../components/Container/Container";
import useUserSelector from "../../../../hooks/useUserSelector";
import {Travel} from "../../../../classes/StoreEntities";
import {PageHeader} from "../../../../components/ui";
import Menu from "../../../../components/Menu/Menu";
import {DB} from "../../../../db/DB";

import './Main.css'

/**
 * компонент отображает главную страницу приложения
 * @function
 * @name Main
 * @category Pages
 */
export default function Main() {
    const navigate = useNavigate()
    const user = useUserSelector()

    function handleNewTravel() {
        if (user) {
            const travel = new Travel({owner_id: user.id})
            DB.add(travel, user, () => {
                navigate(`/travel/${travel.id}/map/`)
            }, (e) => defaultHandleError(e, 'Ошибка при создании путешествия'))
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
