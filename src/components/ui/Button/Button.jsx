import React from "react";
import clsx from "clsx";

import  './Button.css'


/**
 * Компонент кнопка
 * @param {string} className
 * @param {boolean} active
 * @param props
 * @param {JSX.Element | string} children
 * @returns {JSX.Element}
 * @category UI-Components

 */
export default function Button({className, children, active = true, ...props}){

    return <button  className={clsx('full-screen-btn', active && 'active', className)} {...props}>
            {children || ''}
        </button>
}