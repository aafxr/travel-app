import {useContext} from "react";
import {useNavigate} from "react-router-dom";

import Navigation from "../../../../components/Navigation/Navigation";
import {UserContext} from "../../../../contexts/UserContextProvider";
import Container from "../../../../components/Container/Container";
import {PageHeader} from "../../../../components/ui";
import TelegramAuth from "../../TelegramAuth";
import sleep from "../../../../utils/sleep";
import aFetch from "../../../../axios";

/**
 * компонент реализует способы авторизации пользователя
 * @function
 * @name Login
 * @returns {JSX.Element}
 * @category Pages
 */
export default function Login() {
    const navigate = useNavigate()
    const {login} = useContext(UserContext)

    /**
     * обработчик, получает от telegram инфо о авторизации пользователя и отправляет на удаленный сервер
     * @param {UserTelegramAuthPayloadType} user
     */
    function tgAuthHandler(user) {
        aFetch.post('/user/auth/tg/', user)
            .then(res => res.data)
            .then(res => {
                const {ok, data} = res
                if (ok) {
                    /** после успешной отправки данные пользователя записываются в store */
                    login(data)
                    sleep(500).then(() => navigate(-1))
                }
            })
            .catch(err => console.error(err))
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