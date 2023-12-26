import React from 'react';

import './CategoryFrame.css'
import clsx from "clsx";

/**
 * @param {JSX.Element} icon
 * @param {string} text
 * @param {React.HTMLAttributes<HTMLDivElement>} props
 * @return {JSX.Element}
 * @constructor
 */
function CategoryFrame({icon, text, ...props}) {
    return (
        <div className={clsx('category-frame', props.className)}>
            {icon}
            <div>{text}</div>
        </div>
    );
}

export default CategoryFrame;