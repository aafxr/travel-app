import React from "react";
import {useLocation, useNavigate} from 'react-router-dom'
import clsx from "clsx";
import st from './PageHeader.module.css'


/**
 * компонент добавляет заголовок и стрелку "вернуться назад"
 * @param {boolean} arrowBack
 * @param {string} className
 * @param {string} title
 * @param {JSX.Element} children
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function PageHeader({
                                       arrowBack,
                                       className,
                                       title,
                                       children,
                                       ...props
                                   }) {
    const navigate = useNavigate()
    const {pathname} = useLocation()

    const styles = clsx(
        st['page-header'],
        {
            [st.arrowBack]: !!arrowBack,
            [className]: true
        }
    )


    function backHandler() {
        // const parts = pathname.split('/')
        //
        // const p1 = parts.pop()
        // if (p1 || p1 === '') {
        //     const p2 = parts.pop()
        //     p2 && navigate(parts.join('/') + '/')
        // } else {
        // }
            navigate(-1)
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