import React from "react";
import st from './Button.css'
import clsx from "clsx";

export default function Button({className, children, ...props}){

    return <div className='expenses-btn-container'>
        <button {...props} className={clsx('expenses-btn', className)} >
            {children || ''}
        </button>
    </div>
}