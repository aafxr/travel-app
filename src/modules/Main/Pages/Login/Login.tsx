import {useContext} from "react";
import {useNavigate} from "react-router-dom";

import Navigation from "../../../../components/Navigation/Navigation";
import {UserContext} from "../../../../contexts/UserContextProvider";
import Container from "../../../../components/Container/Container";
import {PageHeader} from "../../../../components/ui";
import TelegramAuth from "../../TelegramAuth";
import sleep from "../../../../utils/sleep";
import aFetch from "../../../../axios";
import {TelegramAuthPayloadType} from "../../../../types/TelegramAuthPayloadType";
import {UserService} from "../../../../classes/services";
import {useAppContext} from "../../../../contexts/AppContextProvider";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";

/**
 * компонент реализует способы авторизации пользователя
 * @function
 * @name Login
 * @returns {JSX.Element}
 * @category Pages
 */
export default function Login() {
    const navigate = useNavigate()
    const context = useAppContext()

    /**
     * обработчик, получает от telegram инфо о авторизации пользователя и отправляет на удаленный сервер
     * @param authPayload
     */
    function tgAuthHandler(authPayload: TelegramAuthPayloadType) {
        UserService.logIn(authPayload)
            .then(user => {
                if(user) context.setUser(user)
                else {
                    context.setUser(null)
                    navigate('/')
                }
            })
            .catch(defaultHandleError)
    }

    return (
        <div className='wrapper'>
            <Container className='content column gap-1'>
                <PageHeader arrowBack title={'Войти'}/>
                <TelegramAuth handleAuth={tgAuthHandler}/>
            </Container>
            <Navigation className='footer'/>
        </div>
    )
}