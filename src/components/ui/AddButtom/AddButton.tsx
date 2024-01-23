import React, {ButtonHTMLAttributes, PropsWithChildren} from "react";
import clsx from "clsx";
import { useNavigate} from "react-router-dom";

import './AddButton.css'


interface AddButtonPropsType extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>{
    to?:string
}

/**
 * Стилезованный компонент button с иконкой "+"
 * @kind component
 * @function
 * @param {string} className css class
 * @param {JSX.Element | string} children child react elements
 * @param {string} [to] - url на который перенаправляется пользователь при клике
 * @param props other props
 * @returns {JSX.Element}
 * @category UI-Components
 * @name AddButton
 */
export default function AddButton({className, children, to, ...props}: AddButtonPropsType) {
    const navigate = useNavigate()

    function handler() {
        to && navigate(to)
    }

    return <button onClick={handler} {...props} className={clsx('add-btn gap-0.5', className)}>
        <img  src={process.env.PUBLIC_URL + '/icons/add-orange.svg'} alt="add"/>
        {children}
    </button>
}