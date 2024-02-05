import clsx from "clsx";
import {ReactNode, useState} from "react";
import {useNavigate} from "react-router-dom";

import defaultHandleError from "../../utils/error-handlers/defaultHandleError";
import {useAppContext, useUser} from "../../contexts/AppContextProvider";
import MenuIconList from "../MenuIconList/MenuIconList";
import {UserService} from "../../classes/services";
import useOutside from "../../hooks/useOutside";
import {MenuIcon} from "../svg";

import './Menu.css'

type MenuPropsType = {
    children?: ReactNode,
    className?: string
}

/**
 * Компонент для отображения меню
 * @param children
 * @param className
 * @returns {JSX.Element}
 * @category Components
 */
export default function Menu({children, className}: MenuPropsType) {
    const user = useUser()
    const context = useAppContext()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const {ref} = useOutside<HTMLDivElement>(false, setIsOpen)

    function handleLogin() {
        if (user) {
            UserService.logOut(user)
                .then(() => context.setUser(user))
                .then(() => navigate('/'))
                .catch(defaultHandleError)
        } else {
            navigate('/login/')
        }
    }

    return (
        <div ref={ref} className={clsx('menu', {'open': isOpen}, className)}>
            <div className='menu-dots' onClick={() => setIsOpen(!isOpen)}>
                <MenuIcon/>
            </div>
            <div className='menu-container column gap-0.5'>
                <div className='menu-icons row flex-nowrap gap-1 pb-20'>
                    <MenuIconList/>
                </div>
                {children}
                <div className='menu-item title-semi-bold' onClick={handleLogin}>
                    {user ? 'Выйти' : 'Войти'}
                </div>
            </div>
        </div>
    )
}