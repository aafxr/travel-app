import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

import Container from "../../../../components/Container/Container";
import ErrorReport from "../../../../controllers/ErrorReport";
import Button from "../../../../components/ui/Button/Button";
import Photo from "../../../../components/Poto/Photo";
import {PageHeader} from "../../../../components/ui";
import constants from "../../../../static/constants";
import storeDB from "../../../../db/storeDB/storeDB";
import useUserSelector from "../../../../hooks/useUserSelector";

/**
 * @function
 * @name UserPhotoEdite
 * @returns {JSX.Element}
 * @category Pages
 */
export default function UserPhotoEdite() {
    const user = useUserSelector()
    const navigate = useNavigate()

    const [newPhoto, setNewPhoto] = useState(null)

    function handlePhotoChange(photo) {
        if (photo) {
            setNewPhoto(photo)
        }
    }


    function handleSave() {
        const newUserData = {
            ...user,
            photo: newPhoto.id
        }

        storeDB.editElement(constants.store.IMAGES, newPhoto)
            .then(() => navigate('/profile/'))
            .catch(err => {
                ErrorReport.sendError(err)
                console.error(err)
            })
    }


    console.log({user, newPhoto})
    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader arrowBack/>
                <div className='column center gap-1 pt-20'>
                    <Photo className='photo' id={user?.photo} onChange={handlePhotoChange}/>
                </div>
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave} disabled={!user || !newPhoto}>Сохранить</Button>
            </div>
        </div>
    )
}
