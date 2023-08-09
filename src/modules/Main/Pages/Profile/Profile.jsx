import React, {useContext} from "react";

import Navigation from "../../../../components/Navigation/Navigation";
import {UserContext} from "../../../../contexts/UserContextProvider";
import Container from "../../../../components/Container/Container";
import Curtain from "../../../../components/Curtain/Curtain";
import Menu from "../../../../components/Menu/Menu";
import {PageHeader} from "../../../../components/ui";

import {DEFAULT_IMG_URL} from "../../../../static/constants";

import './Profile.css'

export default function Profile() {
    const {user} = useContext(UserContext)


    return (
        <div className='wrapper'>
            <div className='content hide-scroll'>
                <Container className='header-fixed'>
                    <PageHeader arrowBack MenuEl={<Menu/>}/>
                </Container>
                <div className='profile-backside column gap-1 pt-20'>
                    <div className='title title-bold center'>Профиль</div>
                    <div className='profile-image center' >
                        <img src={user?.photo || DEFAULT_IMG_URL} alt="Фото"/>
                    </div>
                    <div className='profile-user-name center'>
                        <span>{user?.first_name}</span>&nbsp;
                        <span>{user?.last_name}</span>
                    </div>
                </div>
                <Curtain minOffset={54} maxOpenPercent={.6} defaultOffsetPercents={.6} >
                    <Container className='pt-20'>
                        test
                    </Container>
                </Curtain>
            </div>
            <Navigation className='footer'/>
        </div>
    )
}
