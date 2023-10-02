import {useEffect, useRef} from "react";

/**
 * @typedef {Function} HandleTelegramAuthFunction
 * @param {UserAuthType} user
 */

/**
 * компонент добавляет кнопку регистрации телеграм
 * @param {HandleTelegramAuthFunction} handleAuth
 * @return {JSX.Element}
 * @constructor
 */
export default function TelegramAuth({handleAuth}) {
    const ref = useRef(null)

    window.TelegramLoginWidget = {
        dataOnauth: (user) => handleAuth(user),
    };

    /** добавление виджета telegram для получения инфо пользователя */
    useEffect(() => {
        if (ref.current) {
            const script = document.createElement("script");
            script.src = "https://telegram.org/js/telegram-widget.js?22";
            /** имя используемого telegram бота */
            script.setAttribute("data-telegram-login", "MyTravelApp_bot");//Mytralel_bot
            /** размер кнопки телегам */
            script.setAttribute("data-size", "medium");
            /** запрашиваемые права */
            script.setAttribute("data-request-access", "write");
            /** обработчик который обрабатывает инфо присланное от telegram */
            script.setAttribute("data-onauth", "TelegramLoginWidget.dataOnauth(user)" );

            script.async = true;
            ref.current.appendChild(script);
        }
    }, [])


    return (
        <div ref={ref} className='center'/>
    )
}