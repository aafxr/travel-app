import React from "react";
import clsx from "clsx";
import {useLocation, useNavigate} from "react-router-dom";

import './AddButton.css'


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

    function handler() {
        to && navigate(to)
    }

    return <button onClick={handler} {...props} className={clsx('add-btn gap-0.5', className)}>
        <img  src={process.env.PUBLIC_URL + '/icons/add-orange.svg'} alt="add"/>
        {children}
    </button>
}