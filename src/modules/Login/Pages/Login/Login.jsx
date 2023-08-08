import {useContext} from "react";
import aFetch from "../../../../axios";
import {useNavigate} from "react-router-dom";

import Container from "../../../../components/Container/Container";
import {PageHeader} from "../../../../components/ui";
import TelegramAuth from "../../../Main/TelegramAuth";
import {UserContext} from "../../../../contexts/UserContextProvider";

export default function Login() {
    const {setUser} = useContext(UserContext)
    const navigate = useNavigate()

    /**@param {UserAuthType} user */
    function tgAuthHandler(user) {
        aFetch.post('/user/auth/tg/', user)
            .then(res => res.data)
            .then(userData => {
                console.log(userData)
                setUser(userData)
                navigate(-1)
            })
            .catch(err => console.error(err))
    }

    return (
        <div className='wrapper'>
            <Container className='content column gap-1'>
                <PageHeader arrowBack title={'Войти'}/>
                <TelegramAuth handleAuth={tgAuthHandler}/>
            </Container>
        </div>
    )
}