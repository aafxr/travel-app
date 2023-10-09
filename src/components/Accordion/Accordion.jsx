import {useState} from "react";
import clsx from "clsx";

import ChevronRightIcon from "../svg/ChevronRightIcon";

import './Accordion.css'


/**
 * @property {Item} Item
 * @param {string} title
 * @param {string} className
 * @param {JSX.Element} children
 * @return {JSX.Element}
 * @constructor
 * @category Components
 */
function Accordion({title, className, children}) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className={clsx('accordion column', {'open': isOpen}, className)}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className='accordion-header flex-stretch'>
                <span className='accordion-title'>{title}</span>
                <span className='accordion-chevron center flex-0'><ChevronRightIcon/></span>
            </div>
            <div className='accordion-content'>
                {children}
            </div>
        </div>
    )
}

/**
 *
 * @param {title} title
 * @param {title} dascription
 * @param {title} time
 * @param {JSX.Element} icon
 * @return {JSX.Element}
 * @constructor
 */
function Item({title, icon, dascription, time}) {
    return (
        <div className='accordion-item flex-between '>
            <div className='column'>
                <div className='accordion-item-description'>{dascription}</div>
                <div className='accordion-item-title'>{title}</div>
            </div>
            <div className='accordion-item-time'>{time}</div>
            {icon && <span className='accordion-item-icon'>{icon}</span>}
        </div>
    )
}

Accordion.Item = Item
export default Accordion