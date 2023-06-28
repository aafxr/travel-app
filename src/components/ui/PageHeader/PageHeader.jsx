import React from "react";
import {useNavigate} from 'react-router-dom'
import clsx from "clsx";
import st from './PageHeader.module.css'

export default function PageHeader({
                                       arrowBack,
                                       className,
    title,
                                       children,
                                       ...props
                                   }) {
    const navigate = useNavigate()

    const styles = clsx(
        st['page-header'],
        {
            [st.arrowBack]: !!arrowBack,
            className
        })

    function backHandler() {
        navigate(-1)
    }

    return (
        <div className={st['pageHeader-container']}>
            <div className={styles} {...props}>
                {!!arrowBack && <img src={process.env.PUBLIC_URL + '/icons/back.svg'} alt="back" onClick={backHandler}/>}
                {!!title && <div className={st.title}>{title}</div>}
                {children}
            </div>
        </div>
    )
}