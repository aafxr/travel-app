import React, {useContext, useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import {PageHeader} from "../../../../components/ui";
import Container from "../../../../components/Container/Container";

import  {USER_AUTH} from "../../../../static/constants";
import {UserContext} from "../../../../contexts/UserContextProvider.jsx";
import Navigation from "../../../../components/Navigation/Navigation";
import IconButton from "../../../../components/ui/IconButton/IconButton";

export default function Events({
                                 primary_entity_type,
                                 primary_entity_id
                             }) {
    const navigate = useNavigate()
    const {user, setUser} = useContext(UserContext)

    useEffect(() => {
        if (!user) {
            const us = JSON.parse(localStorage.getItem(USER_AUTH))
            if (!us) {
                setUser(us)
            }
        }
    }, [user])

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
