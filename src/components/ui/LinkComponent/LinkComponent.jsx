import React from "react";
import {Link} from "react-router-dom";


import './LinkComponent.css'
import {ChevronRightIcon} from "../../svg";

/**
 * компонент, обернутый в Link(куфсе-кщгеук-вщь) для добавления переходовна страницы
 * @kind component
 * @function
 * @param {string} title текст, тспользуемый в компоненте
 * @param {string} to ссылка, куда будет переход
 * @param {boolean} arrow default = false
 * @returns {JSX.Element}
 * @category UI-Components
 * @name LinkComponent
 */
export default function LinkComponent({title, to, arrow = false}) {
    return (
        <Link to={to} className='link-component flex-stretch'>
            <span className='flex-1'>{title}</span>
            {arrow && (
                <span className='icon center'>
                    <ChevronRightIcon/>
                </span>
            )}
        </Link>
    )
}