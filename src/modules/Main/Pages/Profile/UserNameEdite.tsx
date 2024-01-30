import React from "react";
import {useNavigate} from "react-router-dom";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {useCloneStoreEntity} from "../../../../hooks/useCloneStoreEntity";
import Container from "../../../../components/Container/Container";
import {useAppContext, useUser} from "../../../../contexts/AppContextProvider";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";
import {UserService} from "../../../../classes/services";


/**
 * компонент редактирования иформации пользователя
 * @function
 * @name UserNameEdite
 * @returns {JSX.Element}
 * @category Pages
 */
export default function UserNameEdite() {
    const user = useUser()!
    const context = useAppContext()
    const navigate = useNavigate()
    const {item: updatedUser, change} = useCloneStoreEntity(user)


    function handleFirstName(firstName: string) {
        if (!updatedUser) return
        updatedUser.setFirst_name(firstName)
    }


    function handleLastName(lastName: string) {
        if (!updatedUser) return
        updatedUser.setLast_name(lastName)
    }


    function handleUserName(userName: string) {
        if (!updatedUser) return
        updatedUser.setUsername(userName)
    }


    /** сохранение изменений в инфо о пользователе */
    function handleSave() {
        if (!updatedUser) return
        UserService.update(updatedUser)
            .then(() => context.setUser(updatedUser))
            .then(() => navigate('/profile/'))
            .catch(defaultHandleError)
    }


    if (!updatedUser) return null

    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader arrowBack/>
                <div className='column gap-1'>
                    <div>
                        <div className='title-semi-bold'>Имя</div>
                        <Input value={updatedUser.first_name} placeholder='Имя' onChange={handleFirstName}/></div>
                    <div>
                        <div className='title-semi-bold'>Фамилия</div>
                        <Input value={updatedUser.last_name} placeholder='Фамилия' onChange={handleLastName}/>
                    </div>
                    <div>
                        <div className='title-semi-bold'>Имя пользователя</div>
                        <Input value={updatedUser.username} placeholder='Имя пользователя'
                               onChange={handleUserName}/></div>
                </div>
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave} disabled={!change}>Сохранить</Button>
            </div>
        </div>
    )
}