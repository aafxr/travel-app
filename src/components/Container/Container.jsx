import React from "react";
import clsx from "clsx";

import './container.css'

/**
 * компонент, задает базовые отступы по бокам
 * @param children
 * @param {string} className
 * @returns {JSX.Element}
 * @constructor
 */
export default function Container({children, className}) {

    return <div className={clsx('container', className)}>
        {children}
    </div>
}