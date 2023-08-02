import React from "react";
import clsx from "clsx";

import './container.css'

export default function Container({children, className}) {

    return <div className={clsx('container', className)}>
        {children}
    </div>
}