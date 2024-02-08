import React from "react";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import LinkComponent from "../../../../components/ui/LinkComponent/LinkComponent";
import PhotoComponent from "../../../../components/PhotoComponent/PhotoComponent";
import {useAppContext, useUser} from "../../../../contexts/AppContextProvider";
import Navigation from "../../../../components/Navigation/Navigation";
import Container from "../../../../components/Container/Container";
import Curtain from "../../../../components/Curtain/Curtain";
import {PageHeader} from "../../../../components/ui";
import Menu from "../../../../components/Menu/Menu";

import './Profile.css'
import {Photo} from "../../../../classes/StoreEntities/Photo";
import {UserService} from "../../../../classes/services";


/** компонент отбражает профиль пользователя  */
export default function Profile() {
    const user = useUser()
    const context = useAppContext()

    function handlePhotoChange(blob:Blob){
        if(!user) return
        user.setPhoto(new Photo({blob}))
        UserService.update(user)
            .then(() => context.setUser(user))
            .catch(defaultHandleError)
    }

    if(!user ) return null

    return (
        <div className='wrapper'>
            <div className='content hide-scroll'>
                <Container className='header-fixed'>
                    <PageHeader arrowBack MenuEl={<Menu/>}/>
                </Container>
                <div className='profile-backside column gap-1 pt-20'>
                    <div className='title title-bold center'>Профиль</div>
                    <div className='profile-image center'>
                        <PhotoComponent className='photo' src={user.getPhotoURL} onChange={handlePhotoChange} />
                    </div>
                    <div className='profile-user-name center'>
                        <span>{user.first_name}</span>&nbsp;
                        <span>{user.last_name}</span>
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
