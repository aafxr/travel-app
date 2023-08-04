import {useEffect, useRef} from "react";


export default function TelegramAuth({handleAuth}) {
    const ref = useRef(null)

    window.TelegramLoginWidget = {
        dataOnauth: (user) => handleAuth(user),
    };

    useEffect(() => {
        if (ref.current) {
            const script = document.createElement("script");
            script.src = "https://telegram.org/js/telegram-widget.js?22";
            script.setAttribute("data-telegram-login", "MyTravelApp_bot");//Mytralel_bot
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
        <div ref={ref} className='center'/>
    )
}