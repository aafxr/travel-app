import {useCallback, useEffect, useRef, useState} from "react";

import './Alerts.css'
import Container from "../../../modules/Expenses/components/Container/Container";
import clsx from "clsx";

const ALERT_EVENT_NAME = 'alert-message'

let alertId = 0

/**
 * @typedef {object} AlertPayload
 * @property {'success' | 'warning' | 'danger'} type
 * @property {string} message
 */

/**
 * Помогает генерировать alert-event
 * @param {AlertPayload} payload
 */
export function pushAlertMessage(payload) {
    if (!payload)
        console.warn('Push empty alert ', payload)

    payload.id = alertId++

    document.dispatchEvent(new CustomEvent(ALERT_EVENT_NAME, {
        detail: payload
    }))
}

window.newAlert = pushAlertMessage


export default function Alerts({count = 1}) {
    const [activeAlerts, setActiveAlerts] = useState([])
    const [isEmpty, setIsEmpty] = useState(true)
    const alertsQueue = useRef([])

    console.log('current alerts: ', activeAlerts)
    console.log('queue: ', alertsQueue.current)


    const onNewAlert = useCallback(function (e) {
        console.log(e)
        const {detail} = e

        if (activeAlerts.length < count) {
            setActiveAlerts([...activeAlerts, detail])
        } else {
            alertsQueue.current.push(detail)
            isEmpty && setIsEmpty(false)
        }
    }, [])


    useEffect(() => {
        document.addEventListener(ALERT_EVENT_NAME, onNewAlert)
        return () => document.removeEventListener(ALERT_EVENT_NAME, onNewAlert)
    }, [])


    function handleRemoveAlert(id) {
        console.log(id)
        const buf = activeAlerts.filter(a => a.id !== id)

        if (alertsQueue.current.length) {
            const extraAlert = alertsQueue.current.shift()
            buf.push(extraAlert)

            alertsQueue.current.length === 0 && setIsEmpty(true)
        }

        setActiveAlerts(buf)
    }

    return (
        <div className='alert-container column gap-1'>
            {
                !!activeAlerts.length && activeAlerts.map(({id, type, message}) => (
                    <div
                        key={id}
                        className={clsx('alert-item', type)}
                        onAnimationEnd={() => handleRemoveAlert(id)}
                    >
                        {message}
                        <span onClick={() => handleRemoveAlert(id)} className='close-svg'/>
                        <span className='alert-line' onAnimationEnd={(e) => e.stopPropagation()}/>
                    </div>
                ))
            }
        </div>
    )
}
