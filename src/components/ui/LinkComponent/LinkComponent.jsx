import React from "react";
import {Link} from "react-router-dom";

import ChevronRightIcon from "../../svg/ChevronRightIcon";

import './LinkComponent.css'

/**
 * компонент, обернутый в Link(куфсе-кщгеук-вщь) для добавления переходовна страницы
 * @param {string} title
 * @param {string} to ссылка, куда будет переход
 * @param {boolean} arrow default = false
 * @returns {JSX.Element}
 * @category UI-Components
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