import {useNavigate} from "react-router-dom";

import Container from "../../../../components/Container/Container";
import {PageHeader} from "../../../../components/ui";
import TelegramAuth from "../../TelegramAuth";
import Navigation from "../../../../components/Navigation/Navigation";
import aFetch from "../../../../axios";
import {useDispatch} from "react-redux";
import {actions} from "../../../../redux/store";

export default function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    /**@param {UserAuthType} user */
    function tgAuthHandler(user) {
        aFetch.post('/user/auth/tg/', user)
            .then(res => res.data)
            .then(res => {
                const {ok, data} = res
                if (ok) {
                    dispatch(actions.userActions.updateUser(data))
                    navigate(-1)
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