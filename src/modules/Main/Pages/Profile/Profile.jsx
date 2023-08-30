import React from "react";
import {useSelector} from "react-redux";

import LinkComponent from "../../../../components/ui/LinkComponent/LinkComponent";
import Navigation from "../../../../components/Navigation/Navigation";
import Container from "../../../../components/Container/Container";
import Curtain from "../../../../components/Curtain/Curtain";
import Photo from "../../../../components/Poto/Photo";
import {PageHeader} from "../../../../components/ui";
import storeDB from "../../../../db/storeDB/storeDB";
import Menu from "../../../../components/Menu/Menu";

import constants from "../../../../static/constants";

import './Profile.css'

export default function Profile() {
    const {user} = useSelector(state => state[constants.redux.USER])

    function handlePhotoChange(photo){

        storeDB.editElement(constants.store.IMAGES, photo)
    }

    return (
        <div className='wrapper'>
            <div className='content hide-scroll'>
                <Container className='header-fixed'>
                    <PageHeader arrowBack MenuEl={<Menu/>}/>
                </Container>
                <div className='profile-backside column gap-1 pt-20'>
                    <div className='title title-bold center'>Профиль</div>
                    <div className='profile-image center'>
                        <Photo className='photo' id={user?.photo} onChange={handlePhotoChange} />
                    </div>
                    <div className='profile-user-name center'>
                        <span>{user?.first_name}</span>&nbsp;
                        <span>{user?.last_name}</span>
                    </div>
                </div>
                <Curtain minOffset={54} maxOpenPercent={.6} defaultOffsetPercents={.6}>
                    <Container className='column pt-20'>
                        <LinkComponent title='Настройки' to='/profile/settings/user/' arrow/>
                        <LinkComponent title='Действия' to='/profile/actions/' arrow/>
                        <LinkComponent title='Активные сеансы' to='/profile/sessions/' arrow/>
                    </Container>
                </Curtain>
            </div>
            <Navigation className='footer'/>
        </div>
    )
}
