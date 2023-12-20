import React from 'react';
import {Link} from "react-router-dom";
import clsx from "clsx";

import './TitleAndMore.css'

/**
 * @function
 * @name TitleAndMore
 * @param {string} title
 * @param {string} linkTitle
 * @param {string} to
 * @param {React.HTMLAttributes<HTMLHeadingElement>} props
 * @return {JSX.Element}
 */
function TitleAndMore({title,linkTitle,  to, ...props}) {
    return (
        <h2  {...props} className={clsx('title-and-more', props.className)}>{title}
            {to && <Link className='link' to={to}>{linkTitle || "Все"}</Link>}
        </h2>
    );
}

export default TitleAndMore;