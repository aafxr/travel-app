import React from 'react'
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import IconButton from "../../../../components/ui/IconButton/IconButton";
import Navigation from "../../../../components/Navigation/Navigation";
import Container from "../../../../components/Container/Container";
import {PageHeader} from "../../../../components/ui";
import constants from "../../../../static/constants";


/**
 * компонент отображает добавленные маршруты в избранное
 * @function
 * @name Favorite
 * @category Pages
 */
export default function Favorite({
                                   primary_entity_type,
                                   primary_entity_id
                               }) {
    const navigate = useNavigate()
    const {user} = useSelector(state => state[constants.redux.USER])


    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader title={'Избранное'} />
                {
                    user
                        ? (
                            <div className='column gap-1'>
                                В разработке
                            </div>
                        ) : (
                            <IconButton
                                border={false}
                                title='Авторизоваться'
                                className='link'
                                onClick={() => navigate('/login/')}
                            />
                        )
                }
            </Container>
            <Navigation className='footer'/>
        </div>
    )
}
