import React, {HTMLAttributes, PropsWithChildren} from "react";
import clsx from "clsx";
import {useLocation, useNavigate} from "react-router-dom";
import './Tab.css'


interface TabPropsType extends PropsWithChildren<HTMLAttributes<HTMLDivElement>>{
    name: React.ReactNode
    to: string
}

/**
 * компонент tab active если  to = location.pathname
 * @kind component
 * @function
 * @param {React.ReactNode} name имя таба
 * @param {string} to url, куда будет перенаправлен пользователь при клике
 * и если loaction.pathname совподает с параметром, то таб подсвеччивается
 * @param {string} className css class
 * @param props
 * @returns {JSX.Element}
 * @category UI-Components
 * @name Tab
 */
export default function Tab({
                                name,
                                to,
                                className,
                                ...props
                            }: TabPropsType) {
    const {pathname} = useLocation()
    const navigate = useNavigate()
    const styles = clsx(
        'tab',
        {
            ['active']: pathname === to,
        },
        className
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