import clsx from "clsx";
import React from "react";

import browserName from "../../utils/browserName";
import dateToStringFormat from "../../utils/dateToStringFormat";

import './SessionItem.css'

/**
 * Компонент отображает элемент списка на странице активных сессий (Session)
 * @param className
 * @param {SessionDataType} sessionData
 * @returns {JSX.Element}
 * @category Components
 */
export default function SessionItem({className, sessionData}) {
    const browser = browserName(sessionData.created_user_agent)

    let browserClass;
    switch(true){
        case /edge|ie/i.test(browser):
            browserClass = 'edge'
            break;
        case /chrome/i.test(browser):
            browserClass = 'chrome'
            break;
        case /firefox/i.test(browser):
            browserClass = 'firefox'
            break;
        case /opera/i.test(browser):
            browserClass = 'opera'
            break;
        case /safari/i.test(browser):
            browserClass = 'safari'
            break;
        default:
            browserClass = 'other'
    }

    return (
        <div className={clsx('session-item flex-stretch gap-0.25 center', className)}>
            <span className={clsx('session-bowser-icon flex-0', browserClass)}/>
            <div className='column flex-1'>
                <div className='session-browser-name'>{browser}</div>
                <div className='session-ip'>
                    {sessionData.updated_ip || ''}&nbsp;
                    {sessionData.active && <span className='small'>(Текущая сессия)</span>}
                </div>
                <div className='session-location'>
                    {sessionData.update_location}&nbsp;-&nbsp;{dateToStringFormat(sessionData.updated_at)}
                </div>
            </div>
        </div>
    )
}
