import React from "react";
import clsx from "clsx";

import './ListItem.css'

/**
 *
 * @param {string} className
 * @param {string} topDescription
 * @param {string} time
 * @param {JSX.Element} children
 * @param {JSX.Element} icon
 * @returns {JSX.Element}
 * @constructor
 */
export default function ListItem({className, topDescription = '', time = '', children, icon}){
    return (
        <div className={clsx('list-item flex-between', className)}>
            <div className='column'>
                <div className='list-item-description'>{topDescription}</div>
                <div className='list-item-title'>{children}</div>
            </div>
            <div className='list-item-time'>{time}</div>
            {!!icon && <span className='list-item-icon'>{icon}</span>}
        </div>
    )
}