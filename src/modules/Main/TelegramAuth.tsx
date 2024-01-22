import {useEffect, useRef} from "react";

/**
 * @typedef {Function} HandleTelegramAuthFunction
 * @param {UserTelegramAuthPayloadType} user
 */

type TelegramPayloadType = {
    id: string,
    first_name: string,
    last_name: string,
    username: string,
    photo_url: string,
    auth_date: string,
    hash: string
}

type TelegramAuthPropsType = {
    handleAuth: (tr_user: TelegramPayloadType) => unknown
}



/**
 * компонент добавляет кнопку регистрации телеграм
 * @function
 * @name TelegramAuth
 * @param {HandleTelegramAuthFunction} handleAuth
 * @return {JSX.Element}
 * @category Pages
 */
export default function TelegramAuth({handleAuth}: TelegramAuthPropsType) {
    const ref = useRef<HTMLDivElement>(null)

    window.TelegramLoginWidget = {
        dataOnauth: (user) => handleAuth(user),
    };

    /** добавление виджета telegram для получения инфо пользователя */
    useEffect(() => {
        if (ref.current) {
            const botName = location.hostname.includes('dev.')
                ? process.env.REACT_APP_DEV_BOT
                : process.env.REACT_APP_BOT

            const script = document.createElement("script");
            script.src = "https://telegram.org/js/telegram-widget.js?22";
            /** имя используемого telegram бота */
            script.setAttribute("data-telegram-login", botName || '');
            /** размер кнопки телегам */
            script.setAttribute("data-size", "medium");
            /** запрашиваемые права */
            script.setAttribute("data-request-access", "write");
            /** обработчик который обрабатывает инфо присланное от telegram */
            script.setAttribute("data-onauth", "TelegramLoginWidget.dataOnauth(user)");

            script.async = true;
            ref.current.appendChild(script);
        }
    }, [])


    return (
        <div ref={ref} className='center'/>
    )
}