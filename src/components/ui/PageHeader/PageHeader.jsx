import React from "react";
import {useLocation, useNavigate} from 'react-router-dom'
import clsx from "clsx";

import isString from "../../../utils/validation/isString";

import './PageHeader.css'


/**
 * компонент добавляет заголовок и стрелку "вернуться назад"
 * @param {boolean} arrowBack - true добавляет стрелочку назад <-
 * @param {string} className
 * @param {string} title - заголовок
 * @param {string} to - url на который перенаправляется пользователь при клике либо назад
 * @param {JSX.Element} children
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function PageHeader({
                                       arrowBack,
                                       className,
                                       title,
                                       to,
                                       children,
                                       ...props
                                   }) {
    const navigate = useNavigate()
    const {pathname} = useLocation()

    const styles = clsx(
        'page-header-container gap-0.25',
        {
            'arrow-back': !!arrowBack,
        },
        className
    )


    function backHandler() {
        isString(to)
            ? navigate(to)
            : navigate(-1)
    }

    return (
        <div className={styles} {...props}>
            {!!arrowBack &&
                <div className='page-header-icon' onClick={backHandler}>
                    {/*<img src={process.env.PUBLIC_URL + '/icons/back.svg'} alt="back"/>*/}
                </div>
            }
            {!!title &&
                <div className='page-header center title-bold'>
                    {title}
                </div>
            }
            {children}
            {!!arrowBack && <div className='page-header-placeholder'/>}
        </div>
    )
}