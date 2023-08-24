import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import Container from "../../../../components/Container/Container";
import {PageHeader} from "../../../../components/ui";
import Button from "../../../../components/ui/Button/Button";
import constants, {DEFAULT_IMG_URL} from "../../../../static/constants";
import {actions} from "../../../../redux/store";
import storeDB from "../../../../db/storeDB/storeDB";
import createId from "../../../../utils/createId";
import ErrorReport from "../../../../controllers/ErrorReport";
import usePhoto from "../../../../hooks/usePhoto";

export default function UserPhotoEdite() {
    const {user} = useSelector(state => state[constants.redux.USER])
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [photo, setPhoto] = useState(null)
    const [newPhoto, setNewPhoto] = useState(null)
    const photoURL = usePhoto(newPhoto?.blob)
    const inputRef = useRef(/**@type{HTMLInputElement}*/null)

    useEffect(() => {
        if (user && !photoURL) {
            storeDB.getOne(constants.store.IMAGES, user.photo || '')
                .then(p => {
                    if (p) {
                        setPhoto(p)
                        setNewPhoto(p)
                    }
                })
        }
    }, [user])


    function handleSave() {
        const newUserData = {
            ...user,
            photo: photo.id
        }

        Promise.all([
            storeDB.editElement(constants.store.USERS, newUserData),
            storeDB.editElement(constants.store.IMAGES, newPhoto)
        ])
            .then(() => dispatch(actions.userActions.updateUser(newUserData)))
            .catch(err => {
                ErrorReport.sendError(err)
                console.error(err)
            })
        navigate('/profile/')
    }

    function handlePhotoChange(/**@type{ChangeEvent<HTMLInputElement>} */e) {
        const file = e.target.files[0]
        if (file) {
            const userPhoto = {
                id: photo?.id || createId(),
                blob: file,
                src: ''
            }
            URL.revokeObjectURL(photoURL || '')
            setNewPhoto(userPhoto)
        }
    }

    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader arrowBack/>
                <div className='column center gap-1 pt-20'>
                    <img className='photo' src={photoURL || DEFAULT_IMG_URL} alt="Фото"
                         onClick={e => inputRef.current?.click()}/>
                    <input ref={inputRef} type="file" hidden onChange={handlePhotoChange} accept={'image/*'}/>
                </div>
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave} disabled={!user || !photo || photo === newPhoto}>Сохранить</Button>
            </div>
        </div>
    )
}
