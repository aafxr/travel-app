import React from "react";
import {Link} from "react-router-dom";

import ChevronRightIcon from "../../svg/ChevronRightIcon";

import './LinkComponent.css'

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