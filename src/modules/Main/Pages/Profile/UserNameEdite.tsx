import React from "react";
import {useNavigate} from "react-router-dom";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import Container from "../../../../components/Container/Container";
import {useAppContext, useUser} from "../../../../contexts/AppContextProvider";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";
import {UserService} from "../../../../classes/services";
import {useUserState} from "../../../../hooks/useUserState";
import {User} from "../../../../classes/StoreEntities";


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
    const [state, setState] = useUserState(user)


    function handleFirstName(firstName: string) {
        if (!state) return
        User.setFirst_name(state.user, firstName)
        setState({...state})
    }


    function handleLastName(lastName: string) {
        if (!state) return
        User.setLast_name(state.user, lastName)
        setState({...state})
    }


    function handleUserName(userName: string) {
        if (!state) return
        User.setUsername(state.user, userName)
        setState({...state})
    }


    /** сохранение изменений в инфо о пользователе */
    function handleSave() {
        if (!state) return
        UserService.update(state.user)
            .then(() => context.setUser(state.user))
            .then(() => navigate('/profile/'))
            .catch(defaultHandleError)
    }


    if (!state) return null

    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader arrowBack/>
                <div className='column gap-1'>
                    <div>
                        <div className='title-semi-bold'>Имя</div>
                        <Input value={state.user.first_name} placeholder='Имя' onChange={handleFirstName}/></div>
                    <div>
                        <div className='title-semi-bold'>Фамилия</div>
                        <Input value={state.user.last_name} placeholder='Фамилия' onChange={handleLastName}/>
                    </div>
                    <div>
                        <div className='title-semi-bold'>Имя пользователя</div>
                        <Input value={state.user.username} placeholder='Имя пользователя'
                               onChange={handleUserName}/></div>
                </div>
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleSave} disabled={state ? !state.change : true}>Сохранить</Button>
            </div>
        </div>
    )
}