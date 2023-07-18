import {useCallback, useEffect, useRef, useState} from "react";

import './Alerts.css'
import Container from "../../modules/Expenses/components/Container/Container";
import clsx from "clsx";

const ALERT_EVENT_NAME = 'alert-message'

let alertId = 0

/**
 * @typedef {object} AlertPayload
 * @property {'info' | 'success' | 'warning' | 'danger'} type
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


export default function Alerts({count = 1, maxAlertsCount = 10}) {
    const activeAlerts = useRef(0)
    const [isEmpty, setIsEmpty] = useState(true)

    const alertsQueue = useRef([])
    const ref = useRef(null)

    const onNewAlert = useCallback(function (e) {
        const {detail} = e

        if (activeAlerts.current < count && ref && ref.current) {
            const {type, message} = detail
            activeAlerts.current += 1
            appendAlert(type, message)
        } else {
            alertsQueue.current.length < maxAlertsCount && alertsQueue.current.push(detail)
            isEmpty && setIsEmpty(false)
        }
    }, [])


    useEffect(() => {
        document.addEventListener(ALERT_EVENT_NAME, onNewAlert)
        return () => document.removeEventListener(ALERT_EVENT_NAME, onNewAlert)
    }, [])


    function handleRemoveAlert(e) {
        if (e.type === 'animationend' && e.target.classList.contains('alert-item')) {
            e.target.remove()
            activeAlerts.current = activeAlerts.current > 0 ? activeAlerts.current - 1 : 0
            addAlertToDOM()
        } else if (e.type === 'click' && e.target.classList.contains('close-svg')) {
            const alertItem = e.target.closest('.alert-item')
            if (alertItem) {
                alertItem.remove()
                activeAlerts.current = activeAlerts.current > 0 ? activeAlerts.current - 1 : 0
                addAlertToDOM()
            }
        }


    }

    function addAlertToDOM() {
        if (alertsQueue.current.length && ref && ref.current) {
            const extraAlert = alertsQueue.current.shift()

            if (extraAlert) {
                const {id, type, message} = extraAlert
                activeAlerts.current += 1
                appendAlert(type, message)
            }
            alertsQueue.current.length === 0 && setIsEmpty(true)
        }
    }

    function appendAlert(type, message) {
        const div = document.createElement('div')
        div.className = clsx('alert-item', type)
        div.innerHTML = `
            ${message}
            <span class="close-svg" ></span>
            <span class="alert-line"></span>
        `
        ref.current.append(div)
    }

    return (
        <div
            ref={ref}
            className='alert-container column-revers gap-1'
            onAnimationEnd={handleRemoveAlert}
            onClick={handleRemoveAlert}
        />
    )
}
