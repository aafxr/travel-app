import {useEffect, useRef} from "react";

import {PageHeader} from "../../components/ui";
import Container from "../../components/Container/Container";


function handleAuth(user) {
    console.log(user)
    localStorage.setItem('user', JSON.stringify(user))
}


export default function TelegramAuth() {
    const ref = useRef(null)

    window.TelegramLoginWidget = {
        dataOnauth: (user) => handleAuth(user),
    };

    useEffect(() => {
        if(ref.current){
            const script = document.createElement("script");
            script.src = "https://telegram.org/js/telegram-widget.js?22";
            script.setAttribute("data-telegram-login", "My_travel");
            script.setAttribute("data-size", "medium");

            script.setAttribute("data-request-access", "write");
            script.setAttribute(
                "data-onauth",
                "TelegramLoginWidget.dataOnauth(user)"
            );

            script.async = true;
            ref.current.appendChild(script);
        }
    }, [])


    return (
        <div >
            <Container>
                <PageHeader title='Авторизация' arrowBack to='/'/>
            </Container>
            <div ref={ref} className='center' />
        </div>
    )
}