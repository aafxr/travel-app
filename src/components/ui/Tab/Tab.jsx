import React from "react";
import clsx from "clsx";
import st from './Tab.module.css'
import {useLocation, useNavigate} from "react-router-dom";

export default function Tab({
                                name,
                                to,
                                className,
                                ...props
                            }) {
    const {pathname} = useLocation()
    const navigate = useNavigate()
    const styles = clsx(
        st.tab,
        {
            [st.active]: pathname === to,
            className
        }
    )

    function clickHandler(){
        if (to){
            navigate(to)
        }
    }

    return <div className={styles} onClick={clickHandler} {...props}>
        {name}
    </div>
}