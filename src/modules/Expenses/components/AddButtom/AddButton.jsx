import React from "react";
import st from './AddButton.module.css'
import clsx from "clsx";
import {useLocation, useNavigate} from "react-router-dom";


/**
 * @param {string} className
 * @param {JSX.Element | string} children
 * @param {string} [to] - url на который перенаправляется пользователь при клике
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function AddButton({className, children, to, props}) {
    const navigate = useNavigate()

    const styles = clsx({
            [st['add-btn']]: true,
        },
        className
    )

    function handler() {
        to && navigate(to)
    }

    return <button onClick={handler} {...props} className={styles}>
        <img src={process.env.PUBLIC_URL + '/icons/add-orange.svg'} alt="add"/>
        {children}
    </button>
}