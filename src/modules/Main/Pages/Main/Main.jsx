import React, {useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import {PageHeader} from "../../../../components/ui";
import Container from "../../../../components/Container/Container";

import constants, {USER_AUTH} from "../../../../static/constants";
import Navigation from "../../../../components/Navigation/Navigation";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import Menu from "../../../../components/Menu/Menu";
import {useDispatch, useSelector} from "react-redux";
import {actions} from "../../../../redux/store";

export default function Main({
                                 primary_entity_type,
                                 primary_entity_id
                             }) {
    const navigate = useNavigate()
    const {user} = useSelector(state => state[constants.redux.USER])
    const dispatch = useDispatch()

    useEffect(() => {
        if (!user) {
            const us = JSON.parse(localStorage.getItem(USER_AUTH))
            if (!us) {
                dispatch(actions.userActions.updateUser(us))
            }
        }
    }, [user, dispatch])

    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader title={'Главная страница'}  MenuEl={<Menu/>} />
                <IconButton
                    border={false}
                    title='+ Добавить'
                    className='link'
                    onClick={() => navigate('/travel/add/')}
                />
            </Container>
            <Navigation className='footer'/>
        </div>
    )
}
