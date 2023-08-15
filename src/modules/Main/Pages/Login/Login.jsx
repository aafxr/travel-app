import {useContext} from "react";
import {useNavigate} from "react-router-dom";

import Container from "../../../../components/Container/Container";
import {PageHeader} from "../../../../components/ui";
import TelegramAuth from "../../TelegramAuth";
import {UserContext} from "../../../../contexts/UserContextProvider";
import Navigation from "../../../../components/Navigation/Navigation";
import aFetch from "../../../../axios";

export default function Login() {
    const {setUser} = useContext(UserContext)
    const navigate = useNavigate()

    /**@param {UserAuthType} user */
    function tgAuthHandler(user) {
        aFetch.post('/user/auth/tg/', user)
            .then(res => res.data)
            .then(res => {
                const {ok, data} = res
                if (ok) {
                    setUser(data)
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