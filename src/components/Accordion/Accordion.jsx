import clsx from "clsx";
import './Accordion.css'
import {useState} from "react";
import ChevronRightIcon from "../svg/ChevronRightIcon";


/**
 * @property {Item} Item
 * @param {string} title
 * @param {string} className
 * @param {JSX.Element} children
 * @return {JSX.Element}
 * @constructor
 */
 function Accordion({title, className, children}){
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className={clsx('accordion column',{'open': isOpen}, className)}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className='accordion-header flex-stretch'>
                <span className='accordion-title'>{title}</span>
                <span className='accordion-chevron center no-resize'><ChevronRightIcon /></span>
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
 * @param {JSX.Element} icon
 * @return {JSX.Element}
 * @constructor
 */
function Item({title, icon}){
    return (
        <div className='accordion-item flex-stretch'>
            <span className='accordion-item-title'>{title}</span>
            {icon && <span className='accordion-item-icon'>{icon}</span>}
        </div>
    )
}

Accordion.Item = Item
export default Accordion