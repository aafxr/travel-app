import React from "react";
import {useLocation, useNavigate} from 'react-router-dom'
import clsx from "clsx";
import st from './PageHeader.module.css'
import isString from "../../../utils/validation/isString";


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
        st['page-header'],
        {
            [st.arrowBack]: !!arrowBack,
        },
        className
    )


    function backHandler() {
        isString(to)
            ? navigate(to)
            : navigate(-1)
    }

    return (
        <div className={st['pageHeader-container']}>
            <div className={styles} {...props}>
                {!!arrowBack &&
                    <img src={process.env.PUBLIC_URL + '/icons/back.svg'} alt="back" onClick={backHandler}/>}
                {!!title && <div className={st.title}>{title}</div>}
                {children}
            </div>
        </div>
    )
}