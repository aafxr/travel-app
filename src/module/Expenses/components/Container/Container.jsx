import React from "react";
import './container.css'
import clsx from "clsx";

export default function Container({children, className}) {

    return <div className={clsx('expenses-container', className)}>
        {children}
    </div>
}