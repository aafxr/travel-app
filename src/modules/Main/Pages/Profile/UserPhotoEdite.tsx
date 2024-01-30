import React from "react";
import {useNavigate} from "react-router-dom";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import PhotoComponent from "../../../../components/PhotoComponent/PhotoComponent";
import {useCloneStoreEntity} from "../../../../hooks/useCloneStoreEntity";
import {PhotoService} from "../../../../classes/services/PhotoService";
import Container from "../../../../components/Container/Container";
import {useAppContext, useUser} from "../../../../contexts/AppContextProvider";
import Button from "../../../../components/ui/Button/Button";
import {PageHeader} from "../../../../components/ui";

/**
 *
 */
export default function UserPhotoEdite() {
    const user = useUser()!
    const context = useAppContext()
    const {item: updatedUser, change} = useCloneStoreEntity(user)
    const navigate = useNavigate()


    function handlePhotoChange(blob: Blob) {
        if (!updatedUser) return
        PhotoService.updateUserPhoto(updatedUser, blob)
            .then(() => context.setUser(updatedUser))
            .then(() => navigate('/profile/'))
            .catch(defaultHandleError)
    }


    function handleSave() {

    }


    if (!updatedUser) return null

    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader arrowBack/>
                <div className='column center gap-1 pt-20'>
                    <PhotoComponent className='photo' src={updatedUser.getPhotoURL} onChange={handlePhotoChange}/>
                </div>
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave} disabled={!change}>Сохранить</Button>
            </div>
        </div>
    )
}
