import {useNavigate} from "react-router-dom";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {TelegramAuthPayloadType} from "../../../../types/TelegramAuthPayloadType";
import Navigation from "../../../../components/Navigation/Navigation";
import {useAppContext} from "../../../../contexts/AppContextProvider";
import Container from "../../../../components/Container/Container";
import {UserService} from "../../../../classes/services";
import {PageHeader} from "../../../../components/ui";
import TelegramAuth from "../../TelegramAuth";

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
                if (user) context.setUser(user)
                else context.setUser(null)
                navigate('/')
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