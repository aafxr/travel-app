import React from 'react'
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import IconButton from "../../../../components/ui/IconButton/IconButton";
import Navigation from "../../../../components/Navigation/Navigation";
import Container from "../../../../components/Container/Container";
import constants from "../../../../static/constants";
import {PageHeader} from "../../../../components/ui";

/**
 * Страница отображения ближайших рекомендуемых событий
 * @function
 * @name Events
 * @param {string} primary_entity_type
 * @param {string} primary_entity_id
 * @returns {JSX.Element}
 * @category Pages
 */
export default function Events({
                                 primary_entity_type,
                                 primary_entity_id
                             }) {
    const navigate = useNavigate()
    const {user} = useSelector(state => state[constants.redux.USER])

    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader title={'События'} />
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
