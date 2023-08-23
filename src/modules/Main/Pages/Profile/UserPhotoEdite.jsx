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

export default function UserPhotoEdite() {
    const {user} = useSelector(state => state[constants.redux.USER])
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [photo, setPhoto] = useState(user?.photo || DEFAULT_IMG_URL)
    const [disabled, setDisabled] = useState(true)
    const inputRef = useRef(/**@type{HTMLInputElement}*/null)

    useEffect(() => {
        if (user) {
            const dis = photo === user.photo
            if (dis !== disabled) {
                setDisabled(dis)
            }
        }
    }, [user,disabled, photo])

    function handleSave() {
        const newUserData =  {
            ...user,
            photo
        }
        dispatch(actions.userActions.updateUser(newUserData))
        navigate('/profile/')
    }

    function handlePhotoChange(/**@type{ChangeEvent<HTMLInputElement>} */e){
        const file = e.target.files[0]

        console.log(file.type)
        storeDB.addElement(constants.store.IMAGES, {
            id: createId(),
            blob: file,
            src: ''
        })
            .then(() => {
                console.log('success write to db')
                storeDB.getAll(constants.store.IMAGES).then(console.log)
            })
    }

    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader arrowBack/>
                <div className='column center gap-1 pt-20'>
                    <img className='photo' src={photo} alt="Фото" onClick={e => inputRef.current?.click()}/>
                    <input ref={inputRef} type="file" hidden onChange={handlePhotoChange} />
                </div>
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave} disabled={disabled}>Сохранить</Button>
            </div>
        </div>
    )
}