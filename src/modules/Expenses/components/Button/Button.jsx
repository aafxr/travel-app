import React from "react";
import clsx from "clsx";

import  './Button.css'


/**
 *
 * @param {string} className
 * @param {JSX.Element | string} children
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Button({className, children, active = true, ...props}){

    return <button {...props} className={clsx('expenses-btn', active && 'active', className)} >
            {children || ''}
        </button>
}