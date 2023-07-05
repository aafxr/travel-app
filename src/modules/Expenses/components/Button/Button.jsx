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
export default function Button({className, children, ...props}){

    return <div className={clsx('expenses-btn-container', className)}>
        <button {...props} className='expenses-btn' >
            {children || ''}
        </button>
    </div>
}