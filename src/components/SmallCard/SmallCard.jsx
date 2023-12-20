import React from 'react';
import clsx from "clsx";

import {DEFAULT_IMG_URL} from "../../static/constants";

import './SmallCard.css'

/**
 * @function
 * @name SmallCard
 * @param {string} imgURL
 * @param {string} subtitle
 * @param {string} title
 * @param {React.HTMLAttributes<HTMLDivElement>} props
 * @return {JSX.Element}
 */
function SmallCard({imgURL, subtitle, title, ...props}) {
    return (
        <div {...props} className={clsx('small-card', props.className)}>
            <div className='small-card-image'>
                <img className='img-abs' src={imgURL || DEFAULT_IMG_URL} alt={title}/>
            </div>
            <div className='small-card-content'>
                <div className='small-card-subtitle'>{subtitle}</div>
                <div className='small-card-title'>{title}</div>
            </div>
        </div>
    );
}

export default SmallCard;