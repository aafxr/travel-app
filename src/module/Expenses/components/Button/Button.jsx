import React from "react";
import clsx from "clsx";

import  './Button.css'

export default function Button({className, children, ...props}){

    return <div className={clsx('expenses-btn-container', className)}>
        <button {...props} className='expenses-btn' >
            {children || ''}
        </button>
    </div>
}