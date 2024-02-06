import React from "react";
import {useNavigate} from "react-router-dom";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import PhotoComponent from "../../../../components/PhotoComponent/PhotoComponent";
import {useAppContext, useUser} from "../../../../contexts/AppContextProvider";
import {PhotoService} from "../../../../classes/services/PhotoService";
import Container from "../../../../components/Container/Container";
import Button from "../../../../components/ui/Button/Button";
import {useUserState} from "../../../../hooks/useUserState";
import {PageHeader} from "../../../../components/ui";

/**
 *
 */
export default function UserPhotoEdite() {
    const user = useUser()!
    const context = useAppContext()
    const [state, setState] = useUserState(user)
    const navigate = useNavigate()


    function handlePhotoChange(blob: Blob) {
        if (!state) return
        PhotoService.updateUserPhoto(state.user, blob)
            .then(() => context.setUser(state.user))
            .then(() => navigate('/profile/'))
            .catch(defaultHandleError)
    }


    function handleSave() {

    }


    if (!state) return null

    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader arrowBack/>
                <div className='column center gap-1 pt-20'>
                    <PhotoComponent className='photo' src={state.user.getPhotoURL} onChange={handlePhotoChange}/>
                </div>
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave} disabled={state ? state.change : true}>Сохранить</Button>
            </div>
        </div>
    )
}
