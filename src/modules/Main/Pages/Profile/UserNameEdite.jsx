import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";

import Container from "../../../../components/Container/Container";
import {updateUser} from "../../../../redux/userStore/updateUser";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";
import createAction from "../../../../utils/createAction";
import constants from "../../../../static/constants";
import storeDB from "../../../../db/storeDB/storeDB";
import useUserSelector from "../../../../hooks/useUserSelector";


/**
 * компонент редактирования иформации пользователя
 * @function
 * @name UserNameEdite
 * @returns {JSX.Element}
 * @category Pages
 */
export default function UserNameEdite() {
    const user = useUserSelector()
    const navigate = useNavigate()

    const [first_name, setFirstName] = useState(user?.first_name || '')
    const [last_name, setLastName] = useState(user?.last_name || '')
    const [username, setUsername] = useState(user?.username || '')
    /** состояние кнопки сохранения */
    const [disabled, setDisabled] = useState(true)

    /** проверка на наличие измененых данных */
    useEffect(() => {
        if (user) {
            let dis = user.first_name === first_name && last_name === user.last_name && username === user.username
            if (disabled !== dis) {
                setDisabled(dis)
            }
        }
    }, [user, first_name, last_name, disabled])

    /** сохранение изменений в инфо о пользователе */
    function handleSave() {
        const newUserData = {
            ...user,
            first_name,
            last_name,
            username
        }
        /** измененные поля пользователя +id */
        const changedFields = Object.keys(newUserData).reduce((acc, key) => {
            if (key === 'id'){
                acc[key] = newUserData[key]
            }  else if(newUserData[key] !== user[key]){
                acc[key] = newUserData[key]
            }
            return acc
        }, {})
        console.log(changedFields)
        const action = createAction(constants.store.USERS, user.id, 'update', changedFields)
        storeDB.addElement(constants.store.STORE_ACTIONS, action)
        navigate('/profile/')
    }

    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader arrowBack/>
                <div className='column gap-1'>
                    <div>
                        <div className='title-semi-bold'>Имя</div>
                        <Input value={first_name} placeholder='Имя' onChange={e => setFirstName(e.target.value)}/></div>
                    <div>
                        <div className='title-semi-bold'>Фамилия</div>
                        <Input value={last_name} placeholder='Фамилия' onChange={e => setLastName(e.target.value)}/>
                    </div>
                    <div>
                        <div className='title-semi-bold'>Имя пользователя</div>
                        <Input value={username} placeholder='Имя пользователя'
                               onChange={e => setUsername(e.target.value)}/></div>
                </div>
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave} disabled={disabled}>Сохранить</Button>
            </div>
        </div>
    )
}