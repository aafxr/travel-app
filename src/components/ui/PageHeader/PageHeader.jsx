import React, {useState} from "react";
import {useNavigate} from 'react-router-dom'
import clsx from "clsx";

import {ArrowBackIcon} from "../../svg";
import isString from "../../../utils/validation/isString";


import './PageHeader.css'


/**
 * компонент добавляет заголовок и стрелку "вернуться назад"
 * @kind component
 * @kind component
 * @function
 * @param {boolean} arrowBack true добавляет стрелочку назад <=
 * @param {string} className css class
 * @param {string} title заголовок
 * @param {string | function} to url на который перенаправляется пользователь при клике либо назад
 * @param {JSX.Element} children child react elements child react elements
 * @param { JSX.Element} MenuEl react element, который будет отображаться при нажатии на иконку меню компонента
 * @param props other element props
 * @returns {JSX.Element}
 * @category UI-Components
 * @name PageHeader
 */
export default function PageHeader({
                                       arrowBack,
                                       className,
                                       title,
                                       to,
                                       MenuEl,
                                       children,
                                       ...props
                                   }) {
    const navigate = useNavigate()
    // const [_, setMenuOpen] = useState(false)
    // const {ref} = useOutside(false, setMenuOpen)

    const styles = clsx(
        'page-header-container gap-0.25',
        {
            // 'row': title,
            'flex-between': !title,
            'arrow-back': !!arrowBack,

        },
        className
    )


    function backHandler() {
        if (typeof to === 'function') {
            to()
        } else if (typeof to === 'string') {
            navigate(to)
        } else {
            navigate(-1)
        }
    }

    return (
        <div className={styles} {...props}>
            <div className='page-header-icon' onClick={arrowBack ? backHandler : () => {
            }}>
                {!!arrowBack && <ArrowBackIcon/>}
            </div>
            {!!title &&
                <div className='page-header center title-bold'>
                    {title}
                </div>
            }
            {children}
            <div className='page-header-icons center raw gap-0.75'>
                {MenuEl}
            </div>
        </div>
    )
}