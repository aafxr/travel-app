import React from "react";
import st from './AddButton.module.css'
import clsx from "clsx";

export default function AddButton({className, children, props}){
    const styles = clsx({
        [st['add-btn']]: true,
        className
    })

    return <button {...props} className={styles}>
        <img src={process.env.PUBLIC_URL + '/icons/add-orange.svg'} alt="add" />
        {children}
    </button>
}