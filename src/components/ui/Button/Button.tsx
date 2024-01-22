import React, {ButtonHTMLAttributes} from "react";
import clsx from "clsx";

import  './Button.css'


interface ButtonPropsType extends ButtonHTMLAttributes<HTMLButtonElement>{
    active?: boolean
}

/**
 * Компонент кнопка
 * @kind component
 * @function
 * @param {string} className css class
 * @param {boolean} active boolean flag добавляет визулаьный вид как disabled-атрибут у native button
 * @param props other props
 * @param {JSX.Element | string} children child react elements
 * @returns {JSX.Element}
 * @category UI-Components
 * @name Button
 */
export default function Button({className, children, active = true, ...props}: ButtonPropsType){

    return (
        <button  className={clsx('full-screen-btn', {active}, className)} {...props}>
            {children || ''}
        </button>
    )
}