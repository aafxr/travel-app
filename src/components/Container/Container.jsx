import React from "react";
import clsx from "clsx";

import './container.css'

/**
 * компонент, задает базовые отступы по бокам
 * @param children
 * @param {string} className css class
 * @returns {JSX.Element}
 * @category Components
 */
export default function Container({children, className}) {

    return <div className={clsx('container', className)}>
        {children}
    </div>
}