import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

import Navigation from "../../../../components/Navigation/Navigation";
import Container from "../../../../components/Container/Container";
import {updateUser} from "../../../../redux/userStore/updateUser";
import {PageHeader} from "../../../../components/ui";
import TelegramAuth from "../../TelegramAuth";
import aFetch from "../../../../axios";
import sleep from "../../../../utils/sleep";

/**
 * компонент реализует способы авторизации пользователя
 * @function
 * @name Login
 * @returns {JSX.Element}
 * @category Pages
 */
export default function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    /**
     * обработчик, получает от telegram инфо о авторизации пользователя и отправляет на удаленный сервер
     * @param {UserAuthType} user
     */
    function tgAuthHandler(user) {
        aFetch.post('/user/auth/tg/', user)
            .then(res => res.data)
            .then(res => {
                const {ok, data} = res
                if (ok) {
                    /** после успешной отправки данные пользователя записываются в store */
                    dispatch(updateUser(data))
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